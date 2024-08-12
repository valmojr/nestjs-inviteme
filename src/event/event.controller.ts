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
import { BearerGuard } from '../auth/bearer.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CreateEventDTO, UpdateEventDTO } from './event.entity';

@UseGuards(BearerGuard)
@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(EventController.name);

  @Post()
  async create(@Body() createEventDto: CreateEventDTO, @Req() req: Request) {
    const { user } = await this.jwtService.verifyAsync(
      req.headers.authorization?.split(' ')[1],
      { secret: process.env.AUTH_SECRET },
    );

    return this.eventService.create({
      ...createEventDto,
      ownerID: createEventDto.ownerID ? createEventDto.ownerID : user.id,
    });
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = this.jwtService.verify(
      req.headers.authorization?.split(' ')[1],
      { secret: process.env.AUTH_SECRET },
    ) as User;

    return this.eventService.findAll(user.id);
  }

  @Get('house/:id')
  findByHouseId(@Param('id') id: string) {
    return this.eventService.findByHouse(id);
  }

  @Get('house')
  findByHouse(@Body() house: House) {
    return this.eventService.findByHouse(house);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Get('partial/:name')
  findPartial(@Param('name') name: string) {
    return this.eventService.findPartial(name);
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() updateEvent: UpdateEventDTO) {
    return this.eventService.update({ id, ...updateEvent });
  }

  @Patch()
  update(@Body() updateEvent: UpdateEventDTO) {
    return this.eventService.update(updateEvent);
  }

  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  @Delete()
  remove(@Body() removeEvent: Event | UpdateEventDTO) {
    return this.eventService.remove(removeEvent.id);
  }
}
