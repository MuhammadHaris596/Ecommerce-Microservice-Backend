import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type CartDocument = HydratedDocument<Cart>;


@Schema()
export class Items{

    @Prop({ required: true })
    productID : string

    @Prop({ required: true, default:1 })
    quantity : number

    @Prop({ required: true, default:1 })
    price : number
}


export const ItemsSchema = SchemaFactory.createForClass(Items);


@Schema()
export class Cart {
  @Prop({ required: true })
  buyerID: string;

  @Prop({type : [ItemsSchema]})
  items : Items[]
  
  @Prop({ required: true })
  subTotal : number;


  @Prop({ default: Date.now })
   createdAt : Date;



  } 
  

export const CartSchema = SchemaFactory.createForClass(Cart);

