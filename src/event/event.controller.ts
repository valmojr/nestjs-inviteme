import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() createEventDto: Event) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() updateEvent: Event) {
    return this.eventService.update({ id, ...updateEvent });
  }

  @Patch()
  update(@Body() updateEvent: Event) {
    return this.eventService.update(updateEvent);
  }

  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  @Delete()
  remove(@Body() removeEvent: Event) {
    return this.eventService.remove(removeEvent.id);
  }
}
