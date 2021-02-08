import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express'
import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
const { description, externalName } = require('../package.json')

const httpsOptions = {
  key: fs.readFileSync('src/secrets/key.pem'),
  cert: fs.readFileSync('src/secrets/cert.pem')
}

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  const config = new DocumentBuilder()
    .setTitle(externalName)
    .setDescription(description)
    .setVersion(process.env.npm_package_version)
    .setContact('Bruno Rafante', '', 'rafante2@gmail.com')
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-client', app, document);

  await app.init();

  let httpPort = process.env.HTTP_PORT ?? 8080
  http.createServer(server).listen(httpPort);
  Logger.log(`Api listening http on port ${httpPort}`)

  let httpsPort = process.env.HTTPS_PORT ?? 3443
  Logger.log(`Api listening https on port ${httpsPort}`)
  https.createServer(httpsOptions, server).listen(httpsPort);
}


bootstrap();
