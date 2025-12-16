import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryGrpcController {
  constructor(private readonly inventoryService: InventoryService) {}

  @GrpcMethod('InventoryService', 'GetProduct')
  async getProduct(data: { id: string }) {
    if (!data.id) throw new RpcException('Product ID is required');
    return this.inventoryService.getProductById(data.id);
  }

  @GrpcMethod('InventoryService', 'FindOneProductByCategory')
  async findProductByCategory(data: { categoryID: string }) {
    if (!data.categoryID) throw new RpcException('categoryID ID is required');
    return this.inventoryService.getProductByCategory(data.categoryID);
  }

  @GrpcMethod('InventoryService', 'getProductsImage')
  async getProductsImage(data: { products: any[] }) {
    if (!data.products) throw new RpcException('Product ID is required');
    return this.inventoryService.InventoryData(data.products);
  }

  @GrpcMethod('InventoryService', 'getOrderProducts')
  async getOrderProducts(data: { products: any[] }) {
    if (!data.products) throw new RpcException('Product ID is required');
    return this.inventoryService.orderProducts(data.products);
  }

  @GrpcMethod('InventoryService', 'UpdateProductStock')
  async updateStock(data: { Products: any[] }) {
    if (!data.Products) throw new RpcException('Product ID is required');
    return this.inventoryService.ProductStock(data.Products);
  }
}
