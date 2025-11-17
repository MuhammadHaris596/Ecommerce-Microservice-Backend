import { Injectable } from '@nestjs/common';
import { Category, CategoryDocument } from './Schema/schema.category';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDto } from './DTO/category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async createCategory(categoryData: Partial<Category>) {
    try {
      const category = new this.categoryModel(categoryData);
      return await category.save();
    } catch (err) {
      console.log('Error creating category:', err);
      throw err; // keep Error object
    }
  }
}
