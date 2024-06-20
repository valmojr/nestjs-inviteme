import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Image) {
    return await this.prismaService.image.create({ data });
  }

  async findAll() {
    return await this.prismaService.image.findMany();
  }

  async findOne(imageOrImageId: Image | string) {
    return await this.prismaService.image.findUnique({
      where: {
        id:
          typeof imageOrImageId == 'string'
            ? imageOrImageId
            : imageOrImageId.id,
      },
    });
  }

  async update(data: Image, id?: string) {
    return await this.prismaService.image.update({
      where: { id: id ? id : data.id },
      data,
    });
  }

  async remove(imageOrImageId: Image | string) {
    return await this.prismaService.image.delete({
      where: {
        id:
          typeof imageOrImageId == 'string'
            ? imageOrImageId
            : imageOrImageId.id,
      },
    });
  }
}
