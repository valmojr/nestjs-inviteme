import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Express } from 'express';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { existsSync } from 'fs';
import { AuthGuard } from '../auth/auth.guard';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads/users',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}-${file.originalname}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async userAvatarUpload(
    @Body() body: any,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const imageOnDatabase = await this.imageService.create({
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      filepath: file.path,
    });

    return { message: 'Avatar sent fine!', filename: imageOnDatabase.filepath };
  }

  @UseGuards(AuthGuard)
  @Get('upload/avatar/:imgpath')
  async getUserAvatar(@Param('imgpath') imgpath: string, @Res() res: Response) {
    const uploadsPath = process.env.UPLOADS_PATH;
    const path = join(uploadsPath, 'users', imgpath);

    if (!existsSync(path)) {
      return res.status(404).send('Image not found.');
    }

    res.sendFile(path);
  }
}
