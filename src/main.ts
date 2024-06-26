import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err);
  });

  await app.listen(process.env.PORT || 10000);
}
bootstrap();
