import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err); // Log the error details
  });

  await app.listen(process.env.ENVIRONMENT_PORT || 10000);
}
bootstrap();
