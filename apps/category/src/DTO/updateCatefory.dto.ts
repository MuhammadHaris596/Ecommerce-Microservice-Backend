import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryeDto } from './createCategory.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryeDto) {}
