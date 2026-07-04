import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ==========================================
  // Problem Solving — one problem, two methods
  // ==========================================
  @Post('solve')
  solveProblem(
    @Body('problemDescription') problemDescription: string,
    @Body('improvingParameter') improvingParameter: string,
    @Body('worseningParameter') worseningParameter: string,
  ) {
    return this.appService.solveProblem({
      problemDescription,
      improvingParameter,
      worseningParameter,
    });
  }

  @Get('history')
  getHistory() {
    return this.appService.getHistory();
  }

  @Post('solutions/:id/rate')
  rateSolution(@Param('id') id: string, @Body('rating', ParseIntPipe) rating: number) {
    return this.appService.rateSolution(id, rating);
  }
}
