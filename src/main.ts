import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception:', err);
  });

  {
    const config = new DocumentBuilder()
      .setTitle('InviteMe Swagger')
      .setDescription('InviteMe API Docs')
      .setVersion('0.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT || 10000);
}
bootstrap();
