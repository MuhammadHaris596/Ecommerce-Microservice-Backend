import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { join } from 'path';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import {GlobalExceptionFilter} from '../../shared-Resources/errorHandling/global-exception.filter';
import { setupSwagger } from 'apps/shared-Resources/swagger/swagger';


async function bootstrap() {
  const app = await NestFactory.create(CartModule);

  app.use(cookieParser());

    
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  

   setupSwagger(app, 'Cart Service');


   app.connectMicroservice<MicroserviceOptions>({
    transport : Transport.GRPC,
    options : {
      package : "cart",
        protoPath : join(process.cwd(), 'apps/shared-Resources/protos/cart.proto'),
      url :process.env.Cart_Grpc_Port
    }
  })
  
  
  // Start both HTTP + gRPC
  await app.startAllMicroservices()
  
  await app.listen(process.env.Cart_Port ?? 3005);
  
  console.log(`✅ Cart Service running at http://localhost:${process.env.Cart_Port}`);
  console.log(`✅ GRPC Cart Service running at ${process.env.Cart_Grpc_Port}`);

}
bootstrap();

