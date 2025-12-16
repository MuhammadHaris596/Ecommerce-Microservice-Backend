import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryeDto } from './DTO/createCategory.dto';
import { CategoryUploadInterceptor } from './categoryUploader';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDto } from './DTO/updateCatefory.dto';
import { Roles } from 'apps/shared-Resources/roles.decorator';
import { Role } from 'apps/shared-Resources/schema.role';
import { AuthGuard } from 'apps/shared-Resources/auth-service.guard';
import { RolesGuard } from 'apps/shared-Resources/roles.guard';

@ApiBasicAuth()
@ApiTags('category')
@Roles(Role.admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('allCategories')
  // Get logic starts here
  allCategories() {
    return this.categoryService.getAllCategories();
  }

  @Post('addCategory')
  @UseInterceptors(CategoryUploadInterceptor)
  // Post logic starts here
  async createCategory(
    @Body() categoryDto: CreateCategoryeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let addedCategory = file
      ? { ...categoryDto, imageUrl: file.path, imageID: file.filename }
      : categoryDto;
    let created = await this.categoryService.createCategory(addedCategory);

    return { message: 'Category created successfully', category: created };
  }

  @Put('updateCategory/:id')
  @UseInterceptors(CategoryUploadInterceptor)
  // Put logic starts here
  async updateCategory(
    @Param('id') id: string,
    @Body() UpdateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let updateCategoryData = file
      ? { ...UpdateCategoryDto, imageUrl: file.path, imageID: file.filename }
      : UpdateCategoryDto;
    let updateData = await this.categoryService.updateCategory(
      id,
      updateCategoryData,
    );

    return { message: 'Category updated successfully', category: updateData };
  }

  @Delete('deleteCategory/:id')
  // Delete logic starts here
  removeCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
