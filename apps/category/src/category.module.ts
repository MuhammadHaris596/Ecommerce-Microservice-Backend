import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category,CategorySchema } from './Schema/schema.category';
import { ConfigModule } from '@nestjs/config';
import { JwtModule} from '@nestjs/jwt';



@Module({
  imports: [
       ConfigModule.forRoot({ isGlobal: true }),
       
       JwtModule.register({ 
       global: true,
       secret: process.env.JWT_SECRET ,
       signOptions: { expiresIn: '1h' },
      }), 

        MongooseModule.forRoot(process.env.Category_MONGODB_URL as string),

         MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])
  
       ],
  
    controllers: [CategoryController],
  
    providers: [CategoryService],
  
})
export class CategoryModule {}



