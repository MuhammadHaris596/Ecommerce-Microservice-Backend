import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import slugify from 'slugify';

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

CategorySchema.pre('validate', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});




