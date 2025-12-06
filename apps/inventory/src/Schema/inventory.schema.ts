
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Image {

@Prop({required:true})
imageUrl:string;

@Prop({required:true})
imageID:string;

}

export const ProductImageSchema = SchemaFactory.createForClass(Image);


@Schema()
export class Product {
  @Prop({ required: true   })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true  })
  content: string;
  
  @Prop({ required: true })
  price : string;

  @Prop({ required: true })
  stock  : number;

  @Prop({ type: [ProductImageSchema] })
  images : Image[];


  @Prop({required:true})
   sellerID : string;

   @Prop({required:true})
   categoryID : string
  
  @Prop({default : Date.now})
  createdAt : Date;

}

export const ProductSchema = SchemaFactory.createForClass(Product);

