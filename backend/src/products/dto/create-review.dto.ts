import { IsString, IsNumber, IsOptional, Min, Max, IsArray } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
