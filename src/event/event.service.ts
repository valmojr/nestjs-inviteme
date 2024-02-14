import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Event } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CreateEventDTO } from './event.type';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateEventDTO) {
    return await this.prismaService.event.create({
      data: {
        id: `${randomUUID()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      },
    });
  }

  async upsert(data: Event) {
    return await this.prismaService.event.upsert({
      where: {
        id: data.id,
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        ...data,
        id: `${randomUUID()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAll() {
    return await this.prismaService.event.findMany();
  }

  async findOne(idOrEvent: string | Event) {
    if (typeof idOrEvent === 'string') {
      return await this.prismaService.event.findUnique({
        where: {
          id: idOrEvent,
        },
      });
    } else {
      return await this.prismaService.event.findUnique({
        where: {
          id: idOrEvent.id,
        },
      });
    }
  }

  async update(updateEvent: Event) {
    return await this.prismaService.event.update({
      where: {
        id: updateEvent.id,
      },
      data: {
        ...updateEvent,
        updatedAt: new Date(),
      },
    });
  }

  async remove(idOrEvent: string | Event) {
    if (typeof idOrEvent === 'string') {
      return await this.prismaService.event.delete({
        where: {
          id: idOrEvent,
        },
      });
    } else {
      return await this.prismaService.event.delete({
        where: {
          id: idOrEvent.id,
        },
      });
    }
  }
}
