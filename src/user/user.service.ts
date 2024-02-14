import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'discordId'>,
  ) {
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

  async findOne(fidOrUser: string | User) {
    return await this.prismaService.user.findUnique({
      where: {
        id: typeof fidOrUser === 'string' ? fidOrUser : fidOrUser.id,
      },
    });
  }

  async update(data: User) {
    return await this.prismaService.user.update({
      where: {
        id: data.id,
      },
      data: { updatedAt: new Date(), ...data },
    });
  }

  async remove(idOrUser: string | User) {
    return await this.prismaService.user.delete({
      where: {
        id: typeof idOrUser === 'string' ? idOrUser : idOrUser.id,
      },
    });
  }
}
