import { BadRequestException, ConflictException, Inject, Injectable,NotFoundException,OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from '../DTO/dto.order';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './Schema/order.schema';
import { Model } from 'mongoose';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class OrderService implements  OnModuleInit {
  private cartService;
  private inventoryService;

   constructor(@InjectModel(Order.name) private orderModel: Model<Order>,
                   @Inject('CART_SERVICE') private cartclient: ClientGrpc ,
                     @Inject('INVENTORY_SERVICE') private inventoryclient: ClientGrpc
 ) {}

  onModuleInit() {
    this.cartService = this.cartclient.getService('CartService')
    this.inventoryService = this.inventoryclient.getService('InventoryService')


  }
  
  async retrieveOrder(buyerID) {
    if(!buyerID)  throw new BadRequestException("buyerID not found")

      const orderData = await this.orderModel.findOne({ buyerID  : buyerID })

    if(!orderData)  throw new BadRequestException("cartData not found")

      try {
       
      const productData = await lastValueFrom<any>(
        this.inventoryService.getOrderProducts({  products : orderData.items.map(item=> ({productID : item.productID }))  }) )


        return {
          id : orderData._id.toString(),
          buyerID : orderData.buyerID,
          total : orderData.total,
          items : orderData.items.map(item=> {
          
            const product = productData.products.find(p=> p.productID === item.productID);

            return {
            productID : item.productID,
            quantity : item.quantity,
            price : item.price,
            imageURL : product ? product.imageURL : [],
           

            }
         
        })
          

      }
    }  catch (error) {
      throw error;
    }
  }


  async createOrder(dto : CreateProductDto ){

    const cartData = await lastValueFrom<any>(  this.cartService.GetCart({  id: dto.id  }) )

    if(!cartData) throw new BadRequestException("user cart not found")

    
      const orderExist = await this.orderModel.findOne({cartID : cartData.id})

      if(orderExist) throw new ConflictException("order is already placed !")

      const orderData = new this.orderModel({
        cartID : cartData.id,
        buyerID : cartData.buyerID,
        total : cartData.subTotal,

       
        items : cartData.items.map(item=> ({
           productID: item.productID,
          quantity: item.quantity,
          price : item.price
        }))
      })

      const orderDone = await orderData.save()

      if(!orderDone) throw new BadRequestException("unable to create order ")

       
       const  updateProductStock = await lastValueFrom<any>(
        this.inventoryService.UpdateProductStock({ Products: cartData.items.map(item=> ({ProductID : item.productID, quantity :item.quantity }) ) }) )

      //  const  clearCartData = await lastValueFrom<any>(  this.cartService.ClearCart({  id: dto.id }) )


        


      return { message : "order created successfully" ,orderData ,updateProductStock}
  }


  // async removeOrder(id : string){

  //   if(!id) throw new BadRequestException("id not found for deletion")
  //   const removeOrder = await this.orderModel.findByIdAndDelete(id)

  //   if (!removeOrder) throw new NotFoundException("Order not found")

  //      return { message : "order created successfully" ,removeOrder }

  // }
}
