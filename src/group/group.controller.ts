import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { Event, Group } from '@prisma/client';
import { BearerGuard } from '../auth/bearer.guard';
import UserParser from '../util/UserParser';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@UseGuards(BearerGuard)
@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() createGroupDto: Group) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = UserParser(
      req.headers.authorization.split(' ')[1],
      this.jwtService,
    );
    return this.groupService.findAll(user.id);
  }

  @Get('/event/:id')
  findByEventId(@Param('id') id: string) {
    return this.groupService.findByEvent(id);
  }

  @Get('/event')
  findByEvent(@Body() data: Event) {
    return this.groupService.findByEvent(data.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() updateGroupDto: Group) {
    return this.groupService.update({ ...updateGroupDto, id });
  }

  @Patch()
  update(@Body() updateGroupDto: Group) {
    return this.groupService.update(updateGroupDto);
  }

  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @Delete()
  remove(@Body() removeGroupDto: Group) {
    return this.groupService.remove(removeGroupDto.id);
  }
}
