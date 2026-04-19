import { IsString, IsInt, IsEnum, Min, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsEnum(['IN', 'OUT'])
  type: string;

  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  qty: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  user?: string;
}
