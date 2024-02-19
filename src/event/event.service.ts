import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CreateEventDTO } from './event.type';

function EventChecker(data: Event | CreateEventDTO) {
  if (!data.name || !data.startDate) {
    throw new Error('Name and start date are required');
  }

  if (data.startDate && isNaN(data.startDate.getTime())) {
    throw new Error('Start date must be a valid date');
  }

  if (data.startDate && data.endDate) {
    if (data.startDate > data.endDate) {
      throw new Error('Start date must be before end date');
    }
  }

  const now = new Date();
  if (data.startDate < now) {
    throw new Error('Start date must be in the future');
  }

  return data.name !== undefined || data.startDate !== undefined;
}

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateEventDTO) {
    EventChecker(data);
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
    EventChecker(data);
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
    EventChecker(updateEvent);
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
