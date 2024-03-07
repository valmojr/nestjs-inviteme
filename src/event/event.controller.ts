import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  Req,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event, House, User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(EventController.name);

  @Post()
  create(@Body() createEventDto: Event) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = this.jwtService.verify(
      req.headers.authorization.split(' ')[1],
    ) as User;

    return this.eventService.findAll(user.id);
  }

  @Get('house/:id')
  findByHouse(@Param('id') id: string) {
    return this.eventService.findByHouse(id);
  }

  @Get('house')
  findByUser(@Body() house: House) {
    return this.eventService.findByHouse(house);
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
