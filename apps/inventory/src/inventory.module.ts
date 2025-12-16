import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'apps/cloudinary/src/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './Schema/inventory.schema';
import { InventoryGrpcController } from './inventory.grpc.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),

    CloudinaryModule,
    MongooseModule.forRoot(process.env.Inventory_MONGODB_URL as string),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],

  controllers: [InventoryController, InventoryGrpcController],
  providers: [InventoryService],
})
export class InventoryModule {}
