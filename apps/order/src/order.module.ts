import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './Schema/order.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),

    MongooseModule.forRoot(process.env.Order_MONGODB_URL as string),

    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),

    ClientsModule.register([
      {
        name: 'CART_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'cart',
          protoPath: join(
            process.cwd(),
            'apps/shared-Resources/protos/cart.proto',
          ),
          url: process.env.Cart_Grpc_Port,
        },
      },
      {
        name: 'INVENTORY_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'inventory',
          protoPath: join(
            process.cwd(),
            'apps/shared-Resources/protos/product.proto',
          ),
          url: process.env.Inventory_Grpc_Port,
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
