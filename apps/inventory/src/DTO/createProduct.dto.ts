import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  @Type(() => Number) // string -> number conversion
  stock: number;

  @IsString()
  @IsNotEmpty()
  categoryID: string;

  sellerID?: string;

  images?: any[];
}
