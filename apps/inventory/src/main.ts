import { NestFactory } from '@nestjs/core';
import { InventoryModule } from './inventory.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GlobalExceptionFilter } from '../../shared-Resources/errorHandling/global-exception.filter';
import { setupSwagger } from 'apps/shared-Resources/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(InventoryModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  setupSwagger(app, 'Cart Service');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'inventory',
      protoPath: join(
        process.cwd(),
        'apps/shared-Resources/protos/product.proto',
      ),
      url: process.env.Inventory_Grpc_Port,
    },
  });

  // Start both HTTP + gRPC
  await app.startAllMicroservices();

  await app.listen(process.env.Inventory_PORT ?? 3004);
  console.log(
    `✅ Inventory Service running at http://localhost:${process.env.Inventory_PORT}`,
  );
  console.log(
    `✅ GRPC Inventory Service running at ${process.env.Inventory_Grpc_Port}`,
  );
}

bootstrap();
