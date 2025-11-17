import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { CategoryDto } from './DTO/category.dto';
import { upload } from '../../../utility/cloudinary-storage';




@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  

  @Post('addCategory')
  @UseInterceptors(FileInterceptor('image', upload))
  async createCategory(
    @Body() categoryDto: CategoryDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new Error('Image file is required');
    }
    

    const addedCategory = await this.categoryService.createCategory({
      ...categoryDto,
      imageUrl: file.path,
      imageID: file.filename
    });

    return addedCategory;
  }
}

