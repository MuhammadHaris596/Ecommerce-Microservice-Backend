import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category,CategorySchema } from './Schema/schema.category';
import { CloudinaryModule } from 'apps/cloudinary/src/cloudinary.module';
import { CategoryUploadInterceptor } from './categoryUploader';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';




@Module({
  imports: [
          JwtModule.register({
               global: true,
               secret: process.env.JWT_SECRET ,
               signOptions: { expiresIn: '1h' },
              }), 
        
        CloudinaryModule,
        MongooseModule.forRoot(process.env.Category_MONGODB_URL as string),
        MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
           ClientsModule.register([
              {
                name: 'INVENTORY_SERVICE',  
                transport: Transport.GRPC,
                options: {
                  package: 'inventory',
                  protoPath : join( process.cwd(), 'apps/shared-Resources/protos/product.proto'),
                  url : process.env.Inventory_Grpc_Port
                },
              },
      
              
            ])
    ],
  
    controllers: [CategoryController],
  
    providers: [CategoryService],
  
})
export class CategoryModule {}



