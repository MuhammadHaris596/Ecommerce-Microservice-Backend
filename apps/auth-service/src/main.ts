import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GlobalExceptionFilter } from '../../shared-Resources/errorHandling/global-exception.filter';
import { setupSwagger } from 'apps/shared-Resources/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  setupSwagger(app, 'Cart Service');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(process.cwd(), 'apps/shared-Resources/protos/user.proto'),
      url: process.env.User_Grpc_Port,
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.AUTH_PORT || 3001);
  console.log(
    `Auth Service running at http://localhost:${process.env.AUTH_PORT}`,
  );
}
bootstrap();
