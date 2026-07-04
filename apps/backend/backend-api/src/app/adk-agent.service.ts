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

      return {
        advice: this.extractAdvice(events, response.data),
        reasoningTrail: this.buildReasoningTrail(events),
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
}
