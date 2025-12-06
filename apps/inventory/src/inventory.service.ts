import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './DTO/createProduct.dto';
import { UpdateProductDto } from './DTO/updateProduct.dto';
import { Product } from './Schema/inventory.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';



@Injectable()
export class InventoryService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  getHello(): string {
    return 'Hello World!';
  }


  // gRPC method: Get product by ID
  async getProductById(id: string) {
    if (!id) throw new BadRequestException('Product ID is required');

    const product = await this.productModel.findById(id)
    if (!product) throw new NotFoundException('Product not found');

    return {
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      stock: product.stock,
    };
  }
  // gRPC method: Get product by ID
  async getProductByCategory(categoryID : string){

    if (!categoryID) throw new BadRequestException('Category ID is required');

    const productsByCategory = await this.productModel.findOne({categoryID})
    if (!productsByCategory) throw new NotFoundException('Product not found');
    
     return {
      productID: productsByCategory._id.toString(),
    };

  }

  async ProductStock(Products : any[]){
    
    if(Products.length === 0) throw new BadRequestException('Product IDs are required');

    const reteriveProducts  = await this.productModel.find({_id : {$in : Products.map(item => item.ProductID)}});

    if (!reteriveProducts) throw new NotFoundException('Products not found');


    for ( let i = 0 ; i < reteriveProducts.length ; i++){

      if (reteriveProducts[i]._id == Products[i].ProductID){

        console.log(reteriveProducts[i]._id == Products[i].ProductID)

        reteriveProducts[i].stock -= Products[i].quantity;

      }

      await reteriveProducts[i].save();

      

  }

    return {}
  }

  async InventoryData(products : any[]){

    if (products.length == 0) throw new BadRequestException('Product ID is required');

    console.log(products.map(item => item.productID))

    const product = await this.productModel.find({_id : {$in : products.map(item => item.productID)}});

  
    if (product.length == 0) throw new NotFoundException('Product not found');

     
    return {
    products : product.map(item=> ({
      productID : item._id.toString(),
      price : item.price,
      imageURL :  item.images.map(img=> img.imageUrl)
    }))
    }
  }


  async orderProducts(products : any[]){
      if (products.length == 0) throw new BadRequestException('Product ID is required');

    console.log(products.map(item => item.productID))

    const product = await this.productModel.find({_id : {$in : products.map(item => item.productID)}});

  
    if (product.length == 0) throw new NotFoundException('Product not found');

     
    return {
    products : product.map(item=> ({
      productID : item._id.toString(),
      price : item.price,
      imageURL :  item.images.map(img=> img.imageUrl)
    }))
    }

  }
  

  //https Methods

  //get method  // Display cart to the buyer
    
  

  // Create product
  async createProduct(productDto: CreateProductDto) {
    if (!productDto) throw new BadRequestException('Product data is required');

    const existingProduct = await this.productModel.findOne({
      sellerID: productDto.sellerID,
      name: productDto.name,
    });

    if (existingProduct) throw new ConflictException('Product already exists for this seller');

    const newProduct = new this.productModel(productDto);
    return await newProduct.save();
  }

  // Update product 
  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findOne({
      _id: id,
      sellerID: dto.sellerID,
    });

    if (!product) {
      throw new NotFoundException("You don't have permission to update this product");
    }

    Object.assign(product, dto);
    await product.save();

    return {success: true,message: 'Product updated successfully',product};
  }

  // Update product Images
  async uploadImages(id: string, files: Express.Multer.File[], sellerID: string) {
  const product = await this.productModel.findOne({ _id: id, sellerID });

  if (!product) {
    throw new NotFoundException("You don't have permission to upload images");
  }

  const newImages = files.map(file => ({
    imageUrl: file.path,
    imageID: file.filename,
  }));

  product.images.push(...newImages);
  await product.save();

  return {
    success: true, message: 'Images uploaded successfully', images: newImages  };
  
  }


  // Delete product Images
  async deleteImage(id: string, imageID: string, sellerID: string) {
  const product = await this.productModel.findOne({ _id: id, sellerID });

  if (!product) {
    throw new NotFoundException("You don't have permission to delete this image");
  }

  // Remove from Cloudinary
  await cloudinary.uploader.destroy(imageID);

  // Remove from DB array
  product.images = product.images.filter(img => img.imageID !== imageID);

  if (product.images.length === 0) {
    throw new BadRequestException('At least 1 image must remain');
  }

  await product.save();

  return {
    success: true,
    message: 'Image deleted successfully',
    remainingImages: product.images,
  };
}



 



  // Delete product
  async removeProduct(id: string, sellerID: string, adminRole: string) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const isOwner = product.sellerID === sellerID;
    const isAdmin = adminRole === 'admin';
    if (!isOwner && !isAdmin) throw new ForbiddenException('Not allowed to delete this product');

    await this.productModel.findByIdAndDelete(id);
    return { message: 'Product deleted successfully', productID: id };
  }

  // Retrieve products by category
  async retrieveProductByCategory(categoryID: string) {
    if (!categoryID) throw new BadRequestException('Category ID is required');

    const products = await this.productModel.find({ categoryID });
    if (!products || products.length === 0) throw new NotFoundException('No products found for this category');

    return products;
  }
}
