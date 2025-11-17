import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  imageID: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
