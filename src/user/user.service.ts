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

  async findPartial(hash: string) {
    if (!hash) {
      throw new BadRequestException('must have some string to search for');
    }

    const foundNames = await this.prismaService.user.findMany({
      where: {
        username: { contains: hash },
      },
    });

    return foundNames;
  }

  async findOne(data: string | User) {
    if (!data) {
      throw new BadRequestException('data is required');
    }
    return await this.prismaService.user.findUnique({
      where: {
        id: typeof data === 'string' ? data : data.id,
      },
    });
  }

  async findByDiscordId(discordId: string) {
    if (!discordId) {
      throw new BadRequestException('Discord ID is required');
    }
    return await this.prismaService.user.findUnique({
      where: {
        discordId: discordId,
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

  async upsert(data: User) {
    return await this.prismaService.user.upsert({
      where: { id: data.id },
      update: { ...data, updatedAt: new Date() },
      create: data,
    });
  }

  async upsertByDiscord(data: User) {
    return await this.prismaService.user.upsert({
      where: { discordId: data.discordId },
      update: { ...data, updatedAt: new Date() },
      create: data,
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
