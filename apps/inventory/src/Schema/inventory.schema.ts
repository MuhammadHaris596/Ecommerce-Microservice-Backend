
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ required: true , unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true  })
  content: string;
  
  @Prop({ required: true })
  price : string;

  @Prop({ required: true })
  stock  : string;

  @Prop({ required: true })
    imageUrl: string ;

   @Prop({ required: true })
    imageID: string    

  @Prop({default : Date.now})
  createdAt : Date;

  
}

export const ProductSchema = SchemaFactory.createForClass(Product);

