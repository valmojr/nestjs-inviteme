import { Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GroupService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(group: Group) {
    return await this.prismaService.group.create({
      data: {
        ...group,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAll() {
    return await this.prismaService.group.findMany();
  }

  async findOne(idOrGroup: string | Group) {
    return await this.prismaService.group.findUnique({
      where: {
        id: typeof idOrGroup === 'string' ? idOrGroup : idOrGroup.id,
      },
    });
  }

  async update(group: Group) {
    return await this.prismaService.group.update({
      where: {
        id: group.id,
      },
      data: {
        ...group,
        updatedAt: new Date(),
      },
    });
  }

  async remove(idOrGroup: string | Group) {
    return await this.prismaService.group.delete({
      where: {
        id: typeof idOrGroup === 'string' ? idOrGroup : idOrGroup.id,
      },
    });
  }
}