import { NestFactory } from '@nestjs/core';
import { CategoryModule } from './category.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {GlobalExceptionFilter} from '../../shared-Resources/errorHandling/global-exception.filter';
import { setupSwagger } from 'apps/shared-Resources/swagger/swagger';


async function bootstrap() {
  const app = await NestFactory.create(CategoryModule);
  
  app.use(cookieParser());
  
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

   setupSwagger(app, 'Cart Service');

  
   console.log(`✅ Category Service running at http://localhost:${process.env.Category_PORT}`);
   
  await app.listen(process.env.Category_PORT ?? 3003);
}
bootstrap();
