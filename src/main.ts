import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err); // Log the error details
  });

  await app.listen(4000);
}
bootstrap();
