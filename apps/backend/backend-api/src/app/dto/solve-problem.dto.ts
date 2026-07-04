import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// Request body for POST /api/solve — the user's problem statement that both
// the TRIZ and Ideation agents will attempt to solve.
export class SolveProblemDto {
  @ApiProperty({
    description:
      'The problem to solve, in free-form natural language. Solved by both the TRIZ and Ideation agents.',
    example:
      'Our injection-moulded bracket must be stronger, but making it thicker adds too much weight.',
    maxLength: 5000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  problemDescription!: string;

  @ApiProperty({
    description:
      'The parameter that should improve — the "good" side of the technical contradiction fed to the TRIZ agent.',
    example: 'Strength of the bracket',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  improvingParameter!: string;

  @ApiProperty({
    description:
      'The parameter that degrades as a result — the "bad" side of the technical contradiction fed to the TRIZ agent.',
    example: 'Weight of the bracket',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  worseningParameter!: string;
}
