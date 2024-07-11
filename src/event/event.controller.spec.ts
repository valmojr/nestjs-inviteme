import { TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { UserService } from '../user/user.service';
import { Event, House, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { createRequest } from 'node-mocks-http';
import { Request } from 'express';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;
  let jwtService: JwtService;

  let token: string;

  const testUser: User = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    username: 'testUser',
    displayName: 'testUser',
    discordId: null,
    banner: null,
    bannerColor: null,
    avatarId: null,
    email: null,
    password: null,
  };

  const testEvent: Event = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Test Event',
    startDate: new Date(),
    endDate: null,
    thumbnailId: null,
    mainGroupID: null,
    ownerID: testUser.id,
    location: null,
    description: null,
    visibility: 'PUBLIC',
  };

  const testHouse: House = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'testHouse',
    avatar: null,
    public: false,
    discordId: null,
    banner: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        controllers: [EventController],
        providers: [PrismaService, EventService, UserService],
      })
    ).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
    jwtService = module.get<JwtService>(JwtService);

    token = jwtService.sign(
      { user: testUser },
      { secret: process.env.AUTH_SECRET },
    );

    service.create = jest.fn().mockResolvedValueOnce(testEvent);
    service.findAll = jest.fn().mockResolvedValueOnce([testEvent]);
    service.findByHouse = jest.fn().mockResolvedValue([testEvent]);
    service.findPartial = jest.fn().mockResolvedValue([testEvent]);
    service.findOne = jest.fn().mockResolvedValueOnce(testEvent);
    service.update = jest.fn().mockResolvedValueOnce({
      ...testEvent,
      updatedAt: new Date(),
      name: 'Updated Event',
    });
    service.remove = jest.fn().mockResolvedValueOnce({
      ...testEvent,
      name: 'Deleted Event',
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create an event', async () => {
    jwtService.verify = jest.fn().mockResolvedValueOnce(testUser);

    const request: Request = createRequest<any>({
      method: 'POST',
      headers: {
        authorization: `bearer ${token}`,
      },
    }) as Request;

    const event = await controller.create(testEvent, request);

    expect(event).toEqual(testEvent);
  });

  it('should be able to create a event using the creator id as event owner id if the ownerId is not provided', async () => {
    jwtService.verify = jest.fn().mockResolvedValueOnce(testUser);

    const request: Request = createRequest<any>({
      method: 'POST',
      headers: {
        authorization: `bearer ${token}`,
      },
    }) as Request;

    const event = await controller.create(
      { ...testEvent, ownerID: null },
      request,
    );

    expect(event).toEqual(testEvent);
    expect(event.ownerID).toEqual(testUser.id);
  });

  it('should be able to find a event by a house id', async () => {
    const event = await controller.findByHouseId(testHouse.id);

    expect(event).toBeDefined();
    expect(event).toEqual([testEvent]);
  });

  it('should be able to find a event by a house object', async () => {
    const event = await controller.findByHouse(testHouse);

    expect(event).toBeDefined();
    expect(event).toEqual([testEvent]);
  });

  it('should be able to find a event by half of the event name', async () => {
    const event = await controller.findPartial(testEvent.name.split('a')[0]);

    expect(event).toBeDefined();
    expect(event).toEqual([testEvent]);
  });

  it('should be able to find all events', async () => {
    jwtService.verify = jest.fn().mockResolvedValueOnce(testUser);

    const request: Request = createRequest<any>({
      method: 'GET',
      headers: {
        authorization: `bearer ${token}`,
      },
    }) as Request;

    const events = await controller.findAll(request);

    expect(events).toEqual([testEvent]);
  });

  it('should be able to find one event', async () => {
    const event = await controller.findOne(testEvent.id);

    expect(event).toEqual(testEvent);
  });

  it('should be able to update an event by id', async () => {
    const event = await controller.updateById(testEvent.id, testEvent);

    expect(event).toEqual({
      ...testEvent,
      updatedAt: expect.any(Date),
      name: 'Updated Event',
    });
  });

  it('should be able to update an event by object', async () => {
    const event = await controller.update(testEvent);

    expect(event).toEqual({
      ...testEvent,
      updatedAt: expect.any(Date),
      name: 'Updated Event',
    });
  });

  it('should be able to remove an event by id', async () => {
    const event = await controller.removeById(testEvent.id);

    expect(event).toEqual({
      ...testEvent,
      name: 'Deleted Event',
    });
  });

  it('should be able to remove an event by object', async () => {
    const event = await controller.remove(testEvent);

    expect(event).toEqual({
      ...testEvent,
      name: 'Deleted Event',
    });
  });
});
