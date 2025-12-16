import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryGrpcController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Get single product
  @GrpcMethod('InventoryService', 'GetProduct')
  async getProduct(data: { id: string }) {
    if (!data.id) throw new Error('Product ID is required');
    return this.inventoryService.getProductById(data.id);
  }

  // Find product by category
  @GrpcMethod('InventoryService', 'FindOneProductByCategory')
  async findProductByCategory(data: { categoryID: string }) {
    if (!data.categoryID) throw new Error('categoryID ID is required');
    return this.inventoryService.getProductByCategory(data.categoryID);
  }

  // Get products Details  in Cart
  @GrpcMethod('InventoryService', 'getProductsImage')
  async getProductsImage(data: { products: any[] }) {
    if (!data.products) throw new Error('Product ID is required');
    return this.inventoryService.InventoryData(data.products);
  }

  // Get products Details  in  Order
  @GrpcMethod('InventoryService', 'getOrderProducts')
  async getOrderProducts(data: { products: any[] }) {
    if (!data.products) throw new Error('Product ID is required');
    return this.inventoryService.orderProducts(data.products);
  }

  // Update product stock request
  @GrpcMethod('InventoryService', 'UpdateProductStock')
  async updateStock(data: { Products: any[] }) {
    if (!data.Products) throw new Error('Product ID is required');
    return this.inventoryService.ProductStock(data.Products);
  }
}
