import { Injectable } from '@nestjs/common';
import { House } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class HouseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: House) {
    return await this.prismaService.house.create({
      data: {
        ...data,
      },
    });
  }

  async findAll() {
    return await this.prismaService.house.findMany();
  }

  async findOne(idOrHouse: string | House) {
    return await this.prismaService.house.findUnique({
      where: {
        id: typeof idOrHouse === 'string' ? idOrHouse : idOrHouse.id,
      },
    });
  }

  async update(data: House) {
    return await this.prismaService.house.update({
      where: {
        id: data.id,
      },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async remove(data: string | House) {
    return await this.prismaService.house.delete({
      where: {
        id: typeof data === 'string' ? data : data.id,
      },
    });
  }
}
