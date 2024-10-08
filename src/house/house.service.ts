import { BadRequestException, Injectable } from '@nestjs/common';
import { House, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHouseDTO, UpdateHouseDTO } from './house.entity';

@Injectable()
export class HouseService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateHouseDTO) {
    return await this.prismaService.house.create({
      data: {
        ...data,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.house.findMany({
      where: { users: { some: { id: userId } } },
    });
  }

  async findPartial(name: string) {
    return await this.prismaService.house.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
  }

  async findOne(idOrHouse: string | House) {
    return await this.prismaService.house.findUnique({
      where: {
        id: typeof idOrHouse === 'string' ? idOrHouse : idOrHouse.id,
      },
    });
  }

  async findByDiscordId(discordId: string) {
    return await this.prismaService.house.findUnique({
      where: {
        discordId: discordId,
      },
    });
  }

  async findUsers(idOrHouse: string | House) {
    return await this.prismaService.house.findUnique({
      where: {
        id: typeof idOrHouse === 'string' ? idOrHouse : idOrHouse.id,
      },
      select: {
        users: true,
      },
    });
  }

  async upsert(data: House | UpdateHouseDTO) {
    return await this.prismaService.house.upsert({
      where: {
        id: data.id,
      },
      update: { ...data, updatedAt: new Date() },
      create: { ...data },
    });
  }

  async upsertByDiscord(data: House | UpdateHouseDTO) {
    if (!data.discordId) {
      throw new BadRequestException(
        'Discord Id is required to upsert by discord id',
      );
    }
    return await this.prismaService.house.upsert({
      where: {
        discordId: data.discordId,
      },
      update: { ...data, updatedAt: new Date() },
      create: { ...data },
    });
  }

  async update(data: UpdateHouseDTO) {
    return await this.prismaService.house.update({
      where: {
        id: data.id,
      },
      data: { ...data, updatedAt: new Date() },
    });
  }

  async remove(data: string | House | UpdateHouseDTO) {
    if (!data) {
      throw new BadRequestException('House info is required');
    }
    return await this.prismaService.house.delete({
      where: {
        id: typeof data === 'string' ? data : data.id,
      },
    });
  }

  async removeByDiscordId(data: string | House | UpdateHouseDTO) {
    return await this.prismaService.house.delete({
      where: {
        discordId: typeof data === 'string' ? data : data.discordId,
      },
    });
  }

  async addUser(userOrUserId: User | string, houseDiscordId: House | string) {
    return await this.prismaService.house.update({
      where: {
        discordId:
          typeof houseDiscordId === 'string'
            ? houseDiscordId
            : houseDiscordId.discordId,
      },
      data: {
        users: {
          connect: {
            id:
              typeof userOrUserId === 'string' ? userOrUserId : userOrUserId.id,
          },
        },
      },
    });
  }

  async removeUser(
    userOrUserId: User | string,
    houseOrHouseId: House | string,
  ) {
    return await this.prismaService.house.update({
      where: {
        id:
          typeof houseOrHouseId === 'string'
            ? houseOrHouseId
            : houseOrHouseId.id,
      },
      data: {
        users: {
          disconnect: {
            id:
              typeof userOrUserId === 'string' ? userOrUserId : userOrUserId.id,
          },
        },
      },
    });
  }
}
