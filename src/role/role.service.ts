import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: Role) {
    return await this.prismaService.role.create({
      data: {
        ...data,
      },
    });
  }

  async findAll() {
    return await this.prismaService.role.findMany();
  }

  async findOne(idOrRole: string | Role) {
    return await this.prismaService.role.findUnique({
      where: {
        id: typeof idOrRole === 'string' ? idOrRole : idOrRole.id,
      },
    });
  }

  async update(data: Role) {
    return await this.prismaService.role.update({
      where: {
        id: data.id,
      },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async remove(idOrRole: string | Role) {
    return await this.prismaService.role.delete({
      where: {
        id: typeof idOrRole === 'string' ? idOrRole : idOrRole.id,
      },
    });
  }
}
