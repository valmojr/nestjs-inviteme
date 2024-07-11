import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: Role) {
    if (!data) {
      throw new BadRequestException('Role ID is required');
    }
    return await this.prismaService.role.create({
      data,
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.role.findMany({
      where: { user: { id: userId } },
    });
  }

  async findOne(data: string | Role) {
    return await this.prismaService.role.findUnique({
      where: {
        id: typeof data === 'string' ? data : data.id,
      },
    });
  }

  async update(data: Role) {
    if (!data) {
      throw new BadRequestException('Role is required');
    }
    return await this.prismaService.role.update({
      where: {
        id: data.id,
      },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async remove(data: string | Role) {
    if (!data) {
      throw new BadRequestException('Role is required');
    }
    return await this.prismaService.role.delete({
      where: {
        id: typeof data === 'string' ? data : data.id,
      },
    });
  }
}
