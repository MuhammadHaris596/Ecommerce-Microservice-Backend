import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CartService } from './cart.service';

@Controller()
export class CartGrpcController {
  constructor(private readonly cartService: CartService) {}

  @GrpcMethod('CartService', 'GetCart')
  async getCart(data: { id: string }) {
    if(!data.id)  throw new Error('Cart ID is required')
   
      return this.cartService.getCartById(data.id);
  }

  @GrpcMethod('CartService', 'ClearCart')
  async clearCart(data: { id: string }) {
    if(!data.id)  throw new Error('Cart ID is required')
 
       return this.cartService.getCartClearById(data.id);
  }
}
