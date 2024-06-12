import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, House, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CreateEventDTO } from './event.type';

function EventChecker(data: Event | CreateEventDTO) {
  if (!data.name || !data.startDate) {
    throw new BadRequestException('Name and start date are required');
  }

  if (isNaN(new Date(data.startDate).getTime())) {
    throw new BadRequestException('Start date must be a valid date');
  }

  if (data.startDate && data.endDate) {
    if (data.startDate > data.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
  }

  const now = new Date();

  if (data.startDate < now) {
    throw new BadRequestException('Start date must be in the future');
  }

  return true;
}

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateEventDTO, user: User) {
    EventChecker(data);

    if (!data.ownerID) {
      data.ownerID = user.id;
    }

    return await this.prismaService.event.create({
      data: {
        id: `${randomUUID()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
        users: {
          connect: { id: user.id },
        },
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

  async findAll(id: string) {
    return await this.prismaService.event.findMany({
      where: { users: { some: { id } } },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async findByHouse(houseOrHouseId: House | string) {
    return await this.prismaService.event.findMany({
      where: {
        House: {
          some: {
            id:
              typeof houseOrHouseId === 'string'
                ? houseOrHouseId
                : houseOrHouseId.id,
          },
        },
      },
    });
  }

  async findOne(idOrEvent: string | Event) {
    if (!idOrEvent) {
      throw new BadRequestException('Event ID is required');
    }
    return await this.prismaService.event.findUnique({
      where: {
        id: typeof idOrEvent === 'string' ? idOrEvent : idOrEvent.id,
      },
    });
  }

  async findPartial(name: string) {
    return this.prismaService.event.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
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

  async remove(data: string | Event) {
    if (!data) {
      throw new BadRequestException('Event ID is required');
    }
    return await this.prismaService.event.delete({
      where: {
        id: typeof data === 'string' ? data : data.id,
      },
    });
  }
}
