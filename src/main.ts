import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('PayGo Integrator')
    .setDescription('API designated to communicate with PayGo backend')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-client', app, document);

  let httpPort = process.env.HTTP_PORT ?? 3000
  await app.listen(httpPort);

  Logger.log(`Api running on port ${httpPort}`)
}
bootstrap();
