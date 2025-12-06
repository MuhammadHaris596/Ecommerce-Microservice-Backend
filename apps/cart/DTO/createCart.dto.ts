// create-cart.dto.ts
import { IsArray, ValidateNested, IsString, IsOptional, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCartDto {
  
  @IsNotEmpty()
  @IsString()
  productID: string;


  @IsInt()
  @Min(1)
  @IsOptional()
  quantity: number = 1;
}

