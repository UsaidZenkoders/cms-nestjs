import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser = require('body-parser');
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
