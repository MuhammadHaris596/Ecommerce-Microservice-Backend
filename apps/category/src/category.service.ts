import { BadRequestException, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Category } from './Schema/schema.category';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryeDto } from './DTO/createCategory.dto';
import { ConflictException } from '@nestjs/common';
import { UpdateCategoryDto } from './DTO/updateCatefory.dto';
import { v2 as cloudinary } from 'cloudinary';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';



@Injectable()
export class CategoryService implements  OnModuleInit {
   private inventoryService;

  constructor(@InjectModel(Category.name) private categoryModel: Model<Category> ,
               @Inject('INVENTORY_SERVICE') private productclient: ClientGrpc ) {}

               onModuleInit() {
    
                this.inventoryService = this.productclient.getService('InventoryService')
   
                 }

  async getAllCategories() {
    return await this.categoryModel.find()
  }

  async createCategory(categoryData: CreateCategoryeDto) {
    

      const existingCategorySlug = await this.categoryModel.findOne({$or :
        [
          { name: categoryData.name },
          {slug: categoryData.slug }
        ]});
      

        if(existingCategorySlug){
          if(existingCategorySlug.name === categoryData.name ) throw new ConflictException("Category Name already exists")
           if(existingCategorySlug.slug === categoryData.slug ) throw new ConflictException("Category slug already exists")
          }

       
      
        const category = new this.categoryModel(categoryData);
     
        return await category.save();
  
  }


   async updateCategory(id: string, updateCategory: UpdateCategoryDto ) {

    if(!updateCategory)  throw new BadRequestException('No data provided for update');

    


      let category = await this.categoryModel.findById(id);
      
      if(!category ){
        throw new NotFoundException('Category not found');
      }

      
       
     
    

       let duplicacy= await this.categoryModel.findOne({
       
        $or: [
        { name: updateCategory.name },
        { slug: updateCategory.slug },
      ]});

      
      if(duplicacy) {

        if(duplicacy.name == updateCategory.name) throw new  ConflictException("Category with the same name exist")
        if(duplicacy.slug == updateCategory.slug) throw new  ConflictException("Category with the same slug exist")

      }

        if(updateCategory.imageUrl && updateCategory.imageID){
      
          if(category.imageID){
           await cloudinary.uploader.destroy(category.imageID);
          
        }
         category.imageUrl = updateCategory.imageUrl;
        category.imageID = updateCategory.imageID;
      }

      Object.assign(category,updateCategory)

      return category.save();
   }
  


  async deleteCategory(id: string) {

    const category = await this.categoryModel.findById(id)
    if(!category) throw new BadRequestException("category not found")

     const categoryByProduct = await lastValueFrom<any>(  this.inventoryService.FindOneProductByCategory({categoryID: category._id  }) )
     if(categoryByProduct && categoryByProduct.productID) throw  new ConflictException('Category cannot be deleted because it has associated products.');
    
     else{
     await  category.deleteOne()
     }
  }
}

