import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { AdkAgentService, AgentRunResult } from './adk-agent.service';
import { extractCandidates, Candidate } from './candidate-parser';
import { scoreCandidates, selectRecommended } from './scoring.util';

// Flattened candidate for evaluation — normalized across TRIZ/ideation shapes.
interface FlatCandidate {
  candidateId: string;
  solutionId: string;
  method: string;
  title: string;
  description: string;
  globalIndex: number;
}

@Injectable()
export class AppService {
  private readonly guestUserId = 'guest-user';
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly adkAgent: AdkAgentService
  ) {}

  // ==========================================
  // Problem Solving — one problem, two methods
  // ==========================================
  // A single problem is solved by BOTH the TRIZ agent and the free-form
  // ideation agent in parallel. Each produces its own persisted Solution
  // (advice + reasoning trail + raw events). One agent failing never blocks
  // persisting the other.
  async solveProblem(dto: {
    problemDescription: string;
    improvingParameter: string;
    worseningParameter: string;
  }) {
    const problem = await this.prisma.problem.create({
      data: {
        description: dto.problemDescription,
        improvingParameter: dto.improvingParameter,
        worseningParameter: dto.worseningParameter,
      },
    });

    // Build the TRIZ agent message with the explicit contradiction so the
    // agent receives it as structured input rather than inferring it.
    const trizMessage = [
      `Problem: ${dto.problemDescription}`,
      '',
      'Technical contradiction:',
      `- What should improve: ${dto.improvingParameter}`,
      `- What degrades as a result: ${dto.worseningParameter}`,
    ].join('\n');

    // Run both agents in parallel; sessionId = problem.id isolates each problem.
    const [trizResult, ideationResult] = await Promise.allSettled([
      this.adkAgent.runAgent(
        'triz_agent',
        this.guestUserId,
        problem.id,
        trizMessage
      ),
      this.adkAgent.runAgent(
        'ideation_agent',
        this.guestUserId,
        problem.id,
        dto.problemDescription
      ),
    ]);

    const triz = this.unwrap(trizResult, 'triz_agent');
    const ideation = this.unwrap(ideationResult, 'ideation_agent');

    // Best-effort TRIZ structured metadata (null-safe).
    const trizParams = this.adkAgent.extractTrizParams(triz.reasoningTrail);

    // Parse candidates from each agent's advice text.
    const trizCandidates = extractCandidates(triz.advice, 'triz');
    const ideationCandidates = extractCandidates(ideation.advice, 'ideation');

    // Persist both solutions with candidates as JSON.
    const trizSolution = await this.prisma.solution.create({
      data: {
        problemId: problem.id,
        method: 'triz',
        advice: triz.advice,
        reasoningTrail: triz.reasoningTrail as unknown as Prisma.InputJsonValue,
        rawEvents: triz.rawEvents as Prisma.InputJsonValue,
        improvingParamId: trizParams.improvingParamId,
        preservingParamId: trizParams.preservingParamId,
        candidates: trizCandidates as unknown as Prisma.InputJsonValue,
      },
    });

    const ideationSolution = await this.prisma.solution.create({
      data: {
        problemId: problem.id,
        method: 'ideation',
        advice: ideation.advice,
        reasoningTrail:
          ideation.reasoningTrail as unknown as Prisma.InputJsonValue,
        rawEvents: ideation.rawEvents as unknown as Prisma.InputJsonValue,
        candidates: ideationCandidates as unknown as Prisma.InputJsonValue,
      },
    });

    // ==========================================
    // Evaluation + Selection (fail-soft)
    // ==========================================
    // Flatten all candidates into a single list for the evaluation agent.
    const flatCandidates: FlatCandidate[] = [];
    let globalIndex = 0;

    for (const c of trizCandidates) {
      flatCandidates.push({
        candidateId: c.id,
        solutionId: trizSolution.id,
        method: 'triz',
        title: c.title,
        description: this.candidateDescription(c, 'triz'),
        globalIndex: globalIndex++,
      });
    }
    for (const c of ideationCandidates) {
      flatCandidates.push({
        candidateId: c.id,
        solutionId: ideationSolution.id,
        method: 'ideation',
        title: c.title,
        description: this.candidateDescription(c, 'ideation'),
        globalIndex: globalIndex++,
      });
    }

    let evaluation: { recommendedCandidateId: string | null } | null = null;

    if (flatCandidates.length > 0) {
      try {
        const rawScores = await this.adkAgent.evaluateCandidates(
          dto.problemDescription,
          flatCandidates.map((c) => ({
            title: c.title,
            description: c.description,
          }))
        );

        if (rawScores.length > 0) {
          const scored = scoreCandidates(rawScores);
          const recommendedGlobalIndex = selectRecommended(scored);

          // Merge scores back into candidate objects and update solution rows.
          const trizScored = this.mergeScores(
            trizCandidates,
            scored,
            flatCandidates,
            'triz'
          );
          const ideationScored = this.mergeScores(
            ideationCandidates,
            scored,
            flatCandidates,
            'ideation'
          );

          await this.prisma.solution.update({
            where: { id: trizSolution.id },
            data: {
              candidates: trizScored as unknown as Prisma.InputJsonValue,
            },
          });
          await this.prisma.solution.update({
            where: { id: ideationSolution.id },
            data: {
              candidates: ideationScored as unknown as Prisma.InputJsonValue,
            },
          });

          const recommendedFlat =
            recommendedGlobalIndex !== null
              ? flatCandidates[recommendedGlobalIndex]
              : null;

          evaluation = {
            recommendedCandidateId: recommendedFlat?.candidateId ?? null,
          };
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        this.logger.warn(`Evaluation step failed (non-blocking): ${msg}`);
      }
    }

    const result = await this.prisma.problem.findUnique({
      where: { id: problem.id },
      include: { solutions: true },
    });

    return { ...result, evaluation };
  }

  async getHistory() {
    return this.prisma.problem.findMany({
      orderBy: { createdAt: 'desc' },
      include: { solutions: true },
    });
  }

  async rateSolution(id: string, rating: number) {
    const solution = await this.prisma.solution.findUnique({ where: { id } });
    if (!solution) {
      throw new NotFoundException(`Solution ${id} not found`);
    }
    return this.prisma.solution.update({
      where: { id },
      data: { rating },
    });
  }

  // Normalizes an allSettled outcome into an AgentRunResult. A rejected
  // promise (runAgent is designed never to throw, but be defensive) becomes
  // an error advice so the Solution row is still created.
  private unwrap(
    result: PromiseSettledResult<AgentRunResult>,
    appName: string
  ): AgentRunResult {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    const msg =
      result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);
    return {
      advice: `Failed to contact ${appName}: ${msg}`,
      reasoningTrail: [],
      rawEvents: { error: msg },
    };
  }

  // Returns a text description for a candidate, normalized across shapes.
  private candidateDescription(candidate: Candidate, method: string): string {
    if (method === 'triz') {
      const c = candidate as Extract<Candidate, { principleId: string }>;
      return c.description;
    }
    const c = candidate as Extract<Candidate, { mechanism: string }>;
    return `${c.mechanism} ${c.whyItWorks}`;
  }

  // Merges evaluation scores into candidate objects.
  private mergeScores(
    candidates: Candidate[],
    scored: { candidateIndex: number; feasibility: number; novelty: number; impact: number; risk: number; totalScore: number }[],
    flat: FlatCandidate[],
    method: string
  ): Candidate[] {
    return candidates.map((c) => {
      const flatEntry = flat.find(
        (f) => f.candidateId === c.id && f.method === method
      );
      if (!flatEntry) return c;

      const score = scored.find((s) => s.candidateIndex === flatEntry.globalIndex);
      if (!score) return c;

      return {
        ...c,
        feasibility: score.feasibility,
        novelty: score.novelty,
        impact: score.impact,
        risk: score.risk,
        totalScore: score.totalScore,
        recommended: selectRecommended(scored) === flatEntry.globalIndex,
      } as Candidate & {
        feasibility: number;
        novelty: number;
        impact: number;
        risk: number;
        totalScore: number;
        recommended: boolean;
      };
    });
  }
}
