import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

// Request body for POST /api/solutions/:id/rate — per-proposition star rating.
export class RateSolutionDto {
  @ApiProperty({
    description: 'Star rating for the solution, from 1 to 5.',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;
}
