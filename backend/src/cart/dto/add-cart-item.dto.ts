import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  variantId?: string;

  @IsInt()
  @Min(1)
  quantity: number = 1;
}
