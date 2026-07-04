import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { AdkAgentService, AgentRunResult } from './adk-agent.service';

@Injectable()
export class AppService {
  private readonly guestUserId = 'guest-user';

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

    await this.prisma.solution.create({
      data: {
        problemId: problem.id,
        method: 'triz',
        advice: triz.advice,
        reasoningTrail: triz.reasoningTrail as unknown as Prisma.InputJsonValue,
        rawEvents: triz.rawEvents as Prisma.InputJsonValue,
        improvingParamId: trizParams.improvingParamId,
        preservingParamId: trizParams.preservingParamId,
      },
    });

    await this.prisma.solution.create({
      data: {
        problemId: problem.id,
        method: 'ideation',
        advice: ideation.advice,
        reasoningTrail:
          ideation.reasoningTrail as unknown as Prisma.InputJsonValue,
        rawEvents: ideation.rawEvents as Prisma.InputJsonValue,
      },
    });

    return this.prisma.problem.findUnique({
      where: { id: problem.id },
      include: { solutions: true },
    });
  }

  async getHistory() {
    return this.prisma.problem.findMany({
      orderBy: { createdAt: 'desc' },
      include: { solutions: true },
    });
  }

  async rateSolution(id: string, rating: number) {
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
}
