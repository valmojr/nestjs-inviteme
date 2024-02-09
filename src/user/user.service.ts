import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUser, UpdateUser } from './entities/user.entity';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUser) {
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

  async findById(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, data: UpdateUser) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: { updatedAt: new Date(), ...data },
    });
  }

  async remove(idOrUser: string | User) {
    if (typeof idOrUser === 'string') {
      return await this.prismaService.user.delete({
        where: {
          id: idOrUser,
        },
      });
    } else {
      return await this.prismaService.user.delete({
        where: {
          id: idOrUser.id,
        },
      });
    }
  }
}
