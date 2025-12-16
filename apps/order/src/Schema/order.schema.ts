import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  cartID: string;

  @Prop({ required: true })
  buyerID: string;

  @Prop({
    type: [
      {
        productID: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  })
  items: {
    productID: string;
    quantity: number;
    price: number;
  }[];

  @Prop({ required: true })
  total: number;

  // @Prop({ default: 'pending' })
  // paymentStatus: string;

  // @Prop({ default: 'pending' })
  // orderStatus: string;

  // @Prop({ required: true })
  // shippingAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
