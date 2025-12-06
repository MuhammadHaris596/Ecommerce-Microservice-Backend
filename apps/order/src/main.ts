import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import {GlobalExceptionFilter} from '../../shared-Resources/errorHandling/global-exception.filter';
import { setupSwagger } from 'apps/shared-Resources/swagger/swagger';


async function bootstrap() {
  const app = await NestFactory.create(OrderModule);

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new GlobalExceptionFilter());

     setupSwagger(app, 'Cart Service');

  
    await app.listen(process.env.Order_Port ?? 3006);
  console.log(`✅ Order Service running at http://localhost:${process.env.Order_Port}`);
  console.log(`✅ GRPC Cart Service running at ${process.env.Cart_Grpc_Port}`);
  
}
bootstrap();
