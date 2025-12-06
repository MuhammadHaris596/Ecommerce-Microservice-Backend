import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Cart,CartSchema } from './Schema/schema.cart';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { cwd } from 'process';


@Module({
  imports: [



          ConfigModule.forRoot(),
           JwtModule.register({
                 global: true,
                 secret: process.env.JWT_SECRET ,
                 signOptions: { expiresIn: '1h' },
                }), 
         
        
         MongooseModule.forRoot(process.env.Cart_MONGODB_URL as string),
         MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
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

       {
        name: 'USER_SERVICE',  
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath : join( process.cwd(), 'apps/shared-Resources/protos/user.proto'),
          url : process.env.User_Grpc_Port
        },
      },
      
    ])
     ],
  controllers: [CartController],
  providers: [CartService],

  
}

)
export class CartModule {}

