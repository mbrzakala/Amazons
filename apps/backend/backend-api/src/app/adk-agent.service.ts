import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// One normalized, order-preserving step distilled from the ADK event stream.
export interface TrailStep {
  order: number;
  type: 'tool_call' | 'tool_result' | 'thought' | 'message';
  author: string;
  toolName?: string;
  toolCallId?: string;
  args?: unknown;
  response?: unknown;
  isError?: boolean;
  text?: string;
}

// Result of invoking a single ADK agent app.
export interface AgentRunResult {
  advice: string;
  reasoningTrail: TrailStep[];
  rawEvents: unknown;
}

// Structured score for a single candidate, returned by the evaluation agent.
export interface CandidateScore {
  candidateIndex: number;
  feasibility: number;
  novelty: number;
  impact: number;
  risk: number;
}

interface VisibleReasoningSections {
  thinkingProcess?: string;
  finalSolution?: string;
}

// Minimal structural typings for the parts of the ADK event shape we consume.
interface AdkPart {
  text?: string;
  thought?: boolean;
  functionCall?: { id?: string; name?: string; args?: unknown };
  functionResponse?: {
    id?: string;
    name?: string;
    response?: { isError?: boolean; [key: string]: unknown };
  };
}

interface AdkEvent {
  author?: string;
  content?: { role?: string; parts?: AdkPart[] };
}

@Injectable()
export class AdkAgentService {
  private readonly logger = new Logger(AdkAgentService.name);
  private readonly adkAgentUrl =
    process.env.ADK_AGENT_URL || 'http://localhost:8081';

  constructor(private readonly httpService: HttpService) {}

  // Runs one ADK agent app end-to-end (ensure session -> run -> parse).
  // Never throws: an HTTP failure is captured into the returned advice/rawEvents.
  async runAgent(
    appName: string,
    userId: string,
    sessionId: string,
    problemDescription: string
  ): Promise<AgentRunResult> {
    try {
      // 1. Ensure the session exists. Ignore errors (it may already exist).
      const sessionInitUrl = `${this.adkAgentUrl}/apps/${appName}/users/${userId}/sessions/${sessionId}`;
      try {
        await firstValueFrom(this.httpService.post(sessionInitUrl, {}));
      } catch {
        // Safe to ignore if the session already exists.
      }

      // 2. Run the agent.
      const requestPayload = {
        appName,
        userId,
        sessionId,
        newMessage: {
          role: 'user',
          parts: [{ text: problemDescription }],
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.adkAgentUrl}/run`, requestPayload)
      );

      // 3. Response body is an ordered JSON array of ADK events.
      const events: AdkEvent[] = Array.isArray(response.data)
        ? response.data
        : [];

      const advice = this.extractAdvice(events, response.data);
      const visibleSections = this.parseVisibleReasoningSections(advice);
      const reasoningTrail = this.normalizeReasoningTrail(
        this.buildReasoningTrail(events),
        visibleSections
      );

      return {
        advice,
        reasoningTrail,
        rawEvents: response.data,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to contact ${appName}: ${msg}`);
      return {
        advice: `Failed to contact ${appName}: ${msg}`,
        reasoningTrail: [],
        rawEvents: { error: msg },
      };
    }
  }

  // advice = concatenation of all plain (thought:false) text parts from the
  // LAST event that has any such text part; fallback to the stringified events.
  private extractAdvice(events: AdkEvent[], raw: unknown): string {
    for (let i = events.length - 1; i >= 0; i--) {
      const parts = events[i]?.content?.parts ?? [];
      const texts = parts
        .filter((p) => typeof p.text === 'string' && p.thought !== true)
        .map((p) => p.text as string);
      if (texts.length > 0) {
        return texts.join('');
      }
    }
    return JSON.stringify(raw);
  }

  // Flattens every event's parts into ordered, normalized TrailSteps.
  private buildReasoningTrail(events: AdkEvent[]): TrailStep[] {
    const trail: TrailStep[] = [];
    let order = 0;

    for (const event of events) {
      const author = event?.author ?? 'unknown';
      const parts = event?.content?.parts ?? [];

      for (const part of parts) {
        if (part.functionCall) {
          trail.push({
            order: order++,
            type: 'tool_call',
            author,
            toolName: part.functionCall.name,
            toolCallId: part.functionCall.id,
            args: part.functionCall.args,
          });
        } else if (part.functionResponse) {
          trail.push({
            order: order++,
            type: 'tool_result',
            author,
            toolName: part.functionResponse.name,
            toolCallId: part.functionResponse.id,
            response: part.functionResponse.response,
            isError: part.functionResponse.response?.isError,
          });
        } else if (part.thought === true && typeof part.text === 'string') {
          trail.push({
            order: order++,
            type: 'thought',
            author,
            text: part.text,
          });
        } else if (typeof part.text === 'string') {
          trail.push({
            order: order++,
            type: 'message',
            author,
            text: part.text,
          });
        }
      }
    }

    return trail;
  }

  // When a non-tool agent returns only visible text, recover a structured trail
  // from explicit sections in the answer so the DB still stores process + solution.
  private normalizeReasoningTrail(
    trail: TrailStep[],
    visibleSections: VisibleReasoningSections | null
  ): TrailStep[] {
    const hasStructuredSteps = trail.some(
      (step) =>
        step.type === 'thought' ||
        step.type === 'tool_call' ||
        step.type === 'tool_result'
    );

    if (hasStructuredSteps || !visibleSections) {
      return trail;
    }

    const normalized: TrailStep[] = [];
    let order = 0;

    if (visibleSections.thinkingProcess) {
      normalized.push({
        order: order++,
        type: 'thought',
        author: 'root_agent',
        text: visibleSections.thinkingProcess,
      });
    }

    if (visibleSections.finalSolution) {
      normalized.push({
        order: order++,
        type: 'message',
        author: 'root_agent',
        text: visibleSections.finalSolution,
      });
    }

    return normalized.length > 0 ? normalized : trail;
  }

  private parseVisibleReasoningSections(
    text: string
  ): VisibleReasoningSections | null {
    const normalizedText = text.replace(/\r\n/g, '\n');
    const thinkingHeaderMatch = normalizedText.match(
      /(?:^|\n)#{0,6}\s*Thinking Process\s*:?\s*\n/i
    );
    const solutionHeaderMatch = normalizedText.match(
      /(?:^|\n)#{0,6}\s*(?:Final Solution|Solution)\s*:?\s*\n/i
    );
    const problemSectionMatch = normalizedText.match(/(?:^|\n)-\s*Problem\b/i);

    let thinkingProcess: string | undefined;
    let finalSolution: string | undefined;

    if (thinkingHeaderMatch) {
      const thinkingStart = thinkingHeaderMatch.index! + thinkingHeaderMatch[0].length;
      const solutionStart = solutionHeaderMatch?.index;
      const problemStart = problemSectionMatch?.index;
      const thinkingEndCandidates = [solutionStart, problemStart].filter(
        (index): index is number =>
          typeof index === 'number' && index > thinkingStart
      );
      const thinkingEnd =
        thinkingEndCandidates.length > 0
          ? Math.min(...thinkingEndCandidates)
          : normalizedText.length;

      thinkingProcess = normalizedText.slice(thinkingStart, thinkingEnd).trim();

      if (typeof solutionStart === 'number' && solutionStart > thinkingStart) {
        finalSolution = normalizedText
          .slice(solutionStart + solutionHeaderMatch![0].length)
          .trim();
      } else if (typeof problemStart === 'number' && problemStart > thinkingStart) {
        finalSolution = normalizedText.slice(problemStart).trim();
      }
    } else if (solutionHeaderMatch) {
      finalSolution = normalizedText
        .slice(solutionHeaderMatch.index! + solutionHeaderMatch[0].length)
        .trim();
    }

    if (!thinkingProcess && !finalSolution) {
      return null;
    }

    return {
      thinkingProcess,
      finalSolution,
    };
  }

  // Best-effort TRIZ metadata pulled from the browse_contradiction_matrix
  // tool_call args. Fully null-safe: returns nulls if the call/args are absent.
  extractTrizParams(trail: TrailStep[]): {
    improvingParamId: number | null;
    preservingParamId: number | null;
  } {
    const matrixCall = trail.find(
      (step) =>
        step.type === 'tool_call' &&
        step.toolName === 'browse_contradiction_matrix'
    );

    const args = (matrixCall?.args ?? {}) as {
      improving_params?: unknown;
      preserving_params?: unknown;
    };

    return {
      improvingParamId: this.firstIntOrNull(args.improving_params),
      preservingParamId: this.firstIntOrNull(args.preserving_params),
    };
  }

  private firstIntOrNull(value: unknown): number | null {
    const candidate = Array.isArray(value) ? value[0] : value;
    return typeof candidate === 'number' && Number.isInteger(candidate)
      ? candidate
      : null;
  }

  // Runs the evaluation_agent to score all candidates in a single batch.
  // The agent uses ADK's output_schema (Pydantic EvaluationResult) so the
  // response is structured JSON, not prose. Never throws: on failure returns
  // an empty array, and the caller treats null scores as "evaluation unavailable."
  async evaluateCandidates(
    problemDescription: string,
    candidates: { title: string; description: string }[]
  ): Promise<CandidateScore[]> {
    if (candidates.length === 0) return [];

    try {
      const userId = 'guest-user';
      const sessionId = `eval-${Date.now()}`;

      // Ensure session exists (ignore errors if already exists).
      const sessionInitUrl = `${this.adkAgentUrl}/apps/evaluation_agent/users/${userId}/sessions/${sessionId}`;
      try {
        await firstValueFrom(this.httpService.post(sessionInitUrl, {}));
      } catch {
        // Safe to ignore if the session already exists.
      }

      // Build the evaluation prompt with all candidates listed by index.
      const candidateList = candidates
        .map(
          (c, i) =>
            `Candidate ${i}:\n  Title: ${c.title}\n  Description: ${c.description}`
        )
        .join('\n\n');

      const prompt = [
        `Problem: ${problemDescription}`,
        '',
        `Candidates to evaluate (${candidates.length} total):`,
        candidateList,
      ].join('\n');

      const requestPayload = {
        appName: 'evaluation_agent',
        userId,
        sessionId,
        newMessage: {
          role: 'user',
          parts: [{ text: prompt }],
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.adkAgentUrl}/run`, requestPayload)
      );

      const events: AdkEvent[] = Array.isArray(response.data)
        ? response.data
        : [];

      // The evaluation agent uses output_schema, so the final text part
      // contains the structured JSON response matching EvaluationResult.
      const text = this.extractAdvice(events, response.data);
      return this.parseEvaluationResult(text, candidates.length);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to contact evaluation_agent: ${msg}`);
      return [];
    }
  }

  // Parses the structured JSON output from the evaluation agent.
  // Expected shape: { "scores": [{ "candidate_index": 0, "feasibility": 0.8, ... }] }
  private parseEvaluationResult(
    text: string,
    expectedCount: number
  ): CandidateScore[] {
    try {
      // The output_schema response may be pure JSON or embedded in the text.
      // Try direct parse first, then look for a JSON object in the text.
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return [];
        parsed = JSON.parse(jsonMatch[0]);
      }

      const result = parsed as { scores?: unknown };
      if (!result.scores || !Array.isArray(result.scores)) return [];

      return (result.scores as Record<string, unknown>[])
        .filter((s) => typeof s.candidate_index === 'number')
        .map((s) => ({
          candidateIndex: s.candidate_index as number,
          feasibility: this.clampScore(s.feasibility),
          novelty: this.clampScore(s.novelty),
          impact: this.clampScore(s.impact),
          risk: this.clampScore(s.risk),
        }))
        .filter((s) => s.candidateIndex >= 0 && s.candidateIndex < expectedCount);
    } catch {
      this.logger.warn('Failed to parse evaluation agent output');
      return [];
    }
  }

  // Clamps a score value to the 0.0–1.0 range; returns 0 for invalid values.
  private clampScore(value: unknown): number {
    const n = typeof value === 'number' ? value : parseFloat(String(value));
    if (isNaN(n)) return 0;
    return Math.max(0, Math.min(1, n));
  }
}
