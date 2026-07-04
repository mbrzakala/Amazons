import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SolveProblemDto } from './dto/solve-problem.dto';
import { RateSolutionDto } from './dto/rate-solution.dto';

@ApiTags('problems')
@Controller()
export class AppController {
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
