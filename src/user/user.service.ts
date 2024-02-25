import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'discordId'>,
  ) {
    if (!data) {
      throw new BadRequestException('Role ID is required');
    }
    return await this.prismaService.user.create({
      data: {
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      },
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOne(data: string | User) {
    if (!data) {
      throw new BadRequestException('Role ID is required');
    }
    return await this.prismaService.user.findUnique({
      where: {
        id: typeof data === 'string' ? data : data.id,
      },
    });
  }

  async update(data: User) {
    if (!data) {
      throw new BadRequestException('Role ID is required');
    }
    return await this.prismaService.user.update({
      where: {
        id: data.id,
      },
      data: { updatedAt: new Date(), ...data },
    });
  }

  async remove(data: string | User) {
    if (!data) {
      throw new BadRequestException('Role ID is required');
    }
    return await this.prismaService.user.delete({
      where: {
        id: typeof data === 'string' ? data : data.id,
      },
    });
  }
}
