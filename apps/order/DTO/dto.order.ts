import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber } from 'class-validator';


//Category ID taken from DTO

export class CreateProductDto {
 
  @IsString()
  @IsNotEmpty()
  id: string;

}