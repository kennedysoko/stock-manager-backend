import { IsArray, IsString, IsNumber, Min, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  qty: number;
}

export class CheckoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cart: CartItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsString()
  user?: string;
}
