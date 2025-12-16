import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication, serviceName: string) {
  const config = new DocumentBuilder()
    .setTitle(`${serviceName} API`)
    .setDescription(`API documentation for ${serviceName} microservice`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  console.log(' Swagger running on /docs');
}
