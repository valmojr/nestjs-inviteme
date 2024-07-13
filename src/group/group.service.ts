import { BadRequestException, Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDTO, UpdateGroupDTO } from './group.entity';

@Injectable()
export class GroupService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(group: CreateGroupDTO) {
    return await this.prismaService.group.create({
      data: {
        ...group,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.group.findMany({
      where: { users: { some: { id: userId } } },
    });
  }

  async findByEvent(id: string) {
    return await this.prismaService.group.findMany({
      where: { event: { id } },
    });
  }

  async findOne(idOrGroup: string | Group) {
    return await this.prismaService.group.findUnique({
      where: {
        id: typeof idOrGroup === 'string' ? idOrGroup : idOrGroup.id,
      },
    });
  }

  async update(group: UpdateGroupDTO) {
    return await this.prismaService.group.update({
      where: {
        id: group.id,
      },
      data: {
        ...group,
      },
    });
  }

  async remove(data: string | Group) {
    if (!data) {
      throw new BadRequestException('Group ID is required');
    }
    return await this.prismaService.group.delete({
      where: {
        id: typeof data === 'string' ? data : data.id,
      },
    });
  }
}
