import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../shared-Resources/schema.role';
import bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true , unique: true })
  email: string;
  
  @Prop({ required: true })
  password: string;

  @Prop({default : Role.user})
  role : string;

  @Prop()
  resetToken?: string;

  @Prop()
  resetTokenExpiry?: Date;
  
  } 
  

export const UserSchema = SchemaFactory.createForClass(User);

// Add pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
if (!this.isModified('password')) return next();

const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});
