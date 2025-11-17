import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  
  const app = await NestFactory.create(AuthServiceModule);
  
    app.use(cookieParser());
     app.useGlobalPipes(new ValidationPipe());
  
    await app.listen(process.env.AUTH_PORT || 3001);
   console.log(`✅ Auth Service running at http://localhost:${process.env.AUTH_PORT}`);


  }
bootstrap();
