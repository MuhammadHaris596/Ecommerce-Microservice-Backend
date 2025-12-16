import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  imageUrl?: string;

  imageID?: string;
}
