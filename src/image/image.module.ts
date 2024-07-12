import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ImageController],
  providers: [ImageService, PrismaService],
  exports: [ImageService],
})
export class ImageModule {}
