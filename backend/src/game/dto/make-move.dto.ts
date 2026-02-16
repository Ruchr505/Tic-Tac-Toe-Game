import { IsInt, Min, Max } from 'class-validator';

export class MakeMoveDto {
  @IsInt()
  @Min(0)
  @Max(8)
  position: number;
}
