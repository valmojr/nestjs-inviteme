import { Event } from '@prisma/client';

export type CreateEventDTO = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;
