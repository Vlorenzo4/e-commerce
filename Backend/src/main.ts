import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerDoc = new DocumentBuilder()
    .setTitle('Proyecto ecommerce M4')
    .setDescription('Este es el proyecto de ecommerce del M4 de Henry')
    .addBearerAuth()
    .build();

  const swaggerModule = SwaggerModule.createDocument(app, swaggerDoc);

  SwaggerModule.setup('docs', app, swaggerModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
