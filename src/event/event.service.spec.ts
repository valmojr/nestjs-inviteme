import { TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { randomUUID } from 'crypto';

describe('EventService', () => {
  let service: EventService;
  let prisma: PrismaService;

  const testEvent = {
    name: 'name',
    startDate: new Date('2025-03-10'),
    endDate: new Date('2025-03-11'),
    thumbnail: 'thumbnail',
    description: 'description',
    location: 'location',
    mainGroupID: null,
    ownerID: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        providers: [PrismaService, EventService],
      })
    ).compile();

    service = module.get<EventService>(EventService);

    prisma = module.get<PrismaService>(PrismaService);

    prisma.event.create = jest.fn().mockReturnValueOnce({
      id: 1,
      name: 'Event Done!',
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: null,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not be able to create a event if the name or start date are not provided', async () => {
    try {
      const newEvent = await service.create({
        ...testEvent,
        name: null,
        startDate: null,
      });

      expect(newEvent).toThrowErrorMatchingInlineSnapshot(
        "'Name and start date are required'",
      );
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[BadRequestException: Name and start date are required]`,
      );
    }
  });

  it('should not be able to create a event if the start date or end date is not a valid date', async () => {
    try {
      const newEvent = await service.create({
        ...testEvent,
        startDate: new Date('invalid date'),
      });

      expect(newEvent).toThrowErrorMatchingInlineSnapshot(
        "'Start date must be a valid date'",
      );
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[BadRequestException: Start date must be a valid date]`,
      );
    }
  });

  it('should not be able to create a event if the start date is in past', async () => {
    try {
      const newEvent = await service.create({
        ...testEvent,
        startDate: new Date('2020-01-01'),
      });

      expect(newEvent).toThrowErrorMatchingInlineSnapshot(
        "'Start date must be in the future'",
      );
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[BadRequestException: Start date must be in the future]`,
      );
    }
  });

  it('should not be able to create a event if the start date is later than the end date', async () => {
    try {
      const newEvent = await service.create({
        ...testEvent,
        startDate: new Date('2022-01-01'),
        endDate: new Date('2021-01-01'),
      });

      expect(newEvent).toThrowErrorMatchingInlineSnapshot(
        "'Start date must be before end date'",
      );
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[BadRequestException: Start date must be before end date]`,
      );
    }
  });

  it('should be able to create a event', async () => {
    const newEvent = await service.create(testEvent);

    expect(newEvent).toBeDefined();
  });

  it('should be able to upsert a event', async () => {
    prisma.event.upsert = jest.fn().mockReturnValueOnce({
      id: 1,
      name: 'Event Upserted!',
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: null,
    });

    const upsertedEvent = await service.upsert({
      ...testEvent,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(upsertedEvent).toBeDefined();
    expect(upsertedEvent.name).toBe('Event Upserted!');
  });

  it('should be able to get all events', async () => {
    prisma.event.findMany = jest.fn().mockReturnValueOnce([
      {
        id: 1,
        name: 'Event Done!',
        startDate: new Date(),
        endDate: new Date(),
        description: 'description',
        location: 'location',
        thumbnail: 'thumbnail',
        mainGroupID: null,
        ownerID: null,
      },
    ]);

    const allEvents = await service.findAll();

    expect(allEvents).toBeDefined();
    expect(allEvents.length).toBe(1);
  });

  it('should be able to get one event by id', async () => {
    const testId = randomUUID();

    prisma.event.findUnique = jest.fn().mockReturnValueOnce({
      id: testId,
      name: 'Event Done!',
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: null,
    });

    const oneEvent = await service.findOne(testId);

    expect(oneEvent).toBeDefined();
    expect(oneEvent.name).toBe('Event Done!');
    expect(oneEvent.id).toBe(testId);
  });

  it('should be able to get one event by event object', async () => {
    const testId = randomUUID();

    prisma.event.findUnique = jest.fn().mockReturnValueOnce({
      id: testId,
      name: 'Event Done!',
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: null,
    });

    const oneEvent = await service.findOne({
      id: testId,
      name: 'Event Done!',
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: 'something',
    });

    expect(oneEvent).toBeDefined();
    expect(oneEvent.name).toBe('Event Done!');
    expect(oneEvent.id).toBe(testId);
  });

  it('should be able to update a event', async () => {
    prisma.event.update = jest.fn().mockReturnValueOnce({
      id: 1,
      name: 'Event Updated!',
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: null,
    });

    const updatedEvent = await service.update({
      ...testEvent,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(updatedEvent).toBeDefined();
    expect(updatedEvent.name).toBe('Event Updated!');
  });

  it('should be able to delete a event by id', async () => {
    const testId = randomUUID();

    prisma.event.delete = jest.fn().mockReturnValueOnce({
      id: testId,
      name: 'Event Deleted!',
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: null,
    });

    const deletedEvent = await service.remove(testId);

    expect(deletedEvent).toBeDefined();
    expect(deletedEvent.name).toBe('Event Deleted!');
    expect(deletedEvent.id).toBe(testId);
  });

  it('should be able to delete a event by event object', async () => {
    const testId = randomUUID();

    prisma.event.delete = jest.fn().mockReturnValueOnce({
      id: testId,
      name: 'Event Deleted!',
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: null,
    });

    const deletedEvent = await service.remove({
      id: testId,
      name: 'Event Deleted!',
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: 'something',
    });

    expect(deletedEvent).toBeDefined();
    expect(deletedEvent.name).toBe('Event Deleted!');
    expect(deletedEvent.id).toBe(testId);
  });
});
