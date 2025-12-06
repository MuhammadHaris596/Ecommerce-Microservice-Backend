import {  Injectable,OnModuleInit,Inject, BadRequestException } from '@nestjs/common';
import { CreateCartDto } from '../DTO/createCart.dto';
import  type { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './Schema/schema.cart';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class CartService implements  OnModuleInit  {
   private inventoryService;
   private userService;

 
  getProductById(id: string) {
    throw new Error('Method not implemented.');
  }


  
   constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>,
                 @Inject('INVENTORY_SERVICE') private productclient: ClientGrpc ,
                 @Inject('USER_SERVICE') private userclient: ClientGrpc)  {}
  
    onModuleInit() {
    this.inventoryService = this.productclient.getService('InventoryService')
    this.userService = this.userclient.getService('UserService')

  }

  //grpc methods
  async getCartById(id : string){

    if(!id) throw new BadRequestException("cart id not found")
      
      try {

      const cartData = await this.cartModel.findById(id)

        if (!cartData) throw new BadRequestException("cart not found");


      return {
        id : cartData._id.toString(),
        buyerID : cartData.buyerID,
        items : cartData.items,
        subTotal : cartData.subTotal
      }
    } catch (error) {
        throw error
      }

  }


  async getCartClearById(id : string) {
    if(!id) throw new BadRequestException("cart id not found")

      try {
      const ClearCartData = await this.cartModel.findByIdAndDelete(id)

        if (!ClearCartData) throw new BadRequestException("cart not found");

        return {};
      } catch (error) {
        throw error
      }
  }



  //http methods


  async getUserCart(buyerID : string){ 

    if(!buyerID)  throw new BadRequestException("buyerID not found")

      const cartData = await this.cartModel.findOne({ buyerID  : buyerID })

    if(!cartData)  throw new BadRequestException("cartData not found")

       
      const productData = await lastValueFrom<any>(
        this.inventoryService.getProductsImage({  products : cartData.items.map(item=> ({productID : item.productID }))  }) )


        return {
          id : cartData._id.toString(),
          buyerID : cartData.buyerID,
          subtotal : cartData.subTotal,
          items : cartData.items.map(item=> {
          
            const product = productData.products.find(p=> p.productID === item.productID);

            return {
            productID : item.productID,
            quantity : item.quantity,
            price : item.price,
            imageURL : product ? product.imageURL : [],
           

            }
         
        })
          

      }

  }



  async createCart( createDto : CreateCartDto , buyerID  ){
    
  const productData = await lastValueFrom<any>(  this.inventoryService.GetProduct({  id: createDto.productID  }) )
 
  const productPrice = Number(productData.price)
  const  quantity = createDto.quantity ??  1
 
   if(!productData){
    throw  new BadRequestException("Product not found from inventory service")
   }

  
     if (createDto.quantity > productData.stock){
      throw new BadRequestException(`Only ${ productData.stock} items are available `);

     }
     

      let user  =  await  lastValueFrom<any>(  this.userService.UserExist({ id: buyerID }) )

      if(!user){
         throw new BadRequestException("User not found");
      }

      

     let Cart = await this.cartModel.findOne({buyerID : user.id })

     

      if(Cart){

      const existingCart =  Cart.items.find((items)=> items.productID === productData.id)
      if(existingCart){
        existingCart.quantity += quantity
        
     
      }else{
        Cart.items.push({
          productID : createDto.productID,
          quantity ,
          price :productPrice
        })
      }
      
          Cart.subTotal += quantity * productPrice
           
          await Cart.save()
      }else{

        Cart =  new this.cartModel({
          items:[
            {
               productID : createDto.productID,
               quantity 

            }
           
          ],

          subTotal : quantity * productPrice,
          buyerID : user.id

        })

        await Cart.save()
      }
  

      return Cart
     
     
  }


  async removeCart(id : string){

    if(!id){
      throw new BadRequestException("product not found")
    }

    const deleteProduct = await this.cartModel.findByIdAndDelete(id)
    if(!deleteProduct){
      throw new BadRequestException("Product can't delete ")

    }
       
        return  deleteProduct
    
  }
}

