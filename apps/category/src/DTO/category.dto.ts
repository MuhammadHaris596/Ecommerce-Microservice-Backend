import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  slug: string;
}
