import { NestFactory } from '@nestjs/core';
import { ClerkModule } from './clerk.module';

async function bootstrap() {
  const app = await NestFactory.create(ClerkModule);
  await app.listen(process.env.CLERK_PORT ?? 3002);
}
bootstrap();
