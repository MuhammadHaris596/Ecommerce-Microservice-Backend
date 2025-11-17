import { NestFactory } from '@nestjs/core';
import { CategoryModule } from './category.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(CategoryModule);
  
  app.use(cookieParser());
  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.Category_PORT ?? 3003);
   console.log(`✅ Category Service running at http://localhost:${process.env.Category_PORT}`);
}
bootstrap();
