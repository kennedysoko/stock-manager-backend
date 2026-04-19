import { IsString, IsNumber, IsInt, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  cat: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  @Min(0)
  min: number;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsString()
  emoji: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
