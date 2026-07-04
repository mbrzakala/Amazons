import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SolveProblemDto } from './dto/solve-problem.dto';
import { RateSolutionDto } from './dto/rate-solution.dto';

@ApiTags('problems')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  // ==========================================
  // Problem Solving — one problem, two methods
  // ==========================================
  @Post('solve')
  @ApiOperation({
    summary: 'Solve a problem with both the TRIZ and Ideation agents',
    description:
      'Persists the problem, runs both agents in parallel, and returns the ' +
      'problem with both generated solutions (advice + reasoning trail).',
  })
  solveProblem(@Body() dto: SolveProblemDto) {
    // Transport-layer proof of delivery: log the validated payload as soon as
    // it arrives, before any persistence/agent work happens below. If this
    // line never appears in the server log, the request never reached NestJS
    // (check CORS / proxy / global prefix before anything else).
    this.logger.log(`Received problem payload: ${JSON.stringify(dto)}`);
    return this.appService.solveProblem(dto);
  }

  @Get('history')
  @ApiOperation({
    summary: 'List all previously solved problems with their solutions',
  })
  getHistory() {
    return this.appService.getHistory();
  }

  @Post('solutions/:id/rate')
  @ApiOperation({ summary: 'Rate a generated solution from 1 to 5 stars' })
  @ApiParam({ name: 'id', description: 'The Solution id (uuid)' })
  rateSolution(@Param('id') id: string, @Body() dto: RateSolutionDto) {
    return this.appService.rateSolution(id, dto.rating);
  }
}
