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
import { HouseService } from './house.service';
import { House } from '@prisma/client';
import { BearerGuard } from '../auth/bearer.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import UserParser from '../util/UserParser';
import { CreateHouseDTO, UpdateHouseDTO } from './house.entity';

@UseGuards(BearerGuard)
@Controller('house')
export class HouseController {
  constructor(
    private readonly houseService: HouseService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() data: CreateHouseDTO) {
    return this.houseService.create(data);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = UserParser(
      req.headers.authorization.split(' ')[1],
      this.jwtService,
    );
    return this.houseService.findAll(user.id);
  }

  @Get('partial/:name')
  findPartial(@Param('name') name: string) {
    return this.houseService.findPartial(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.houseService.findOne(id);
  }

  @Get('users/:id')
  findUsers(@Param('id') id: string) {
    return this.houseService.findUsers(id);
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() data: UpdateHouseDTO) {
    return this.houseService.update({ ...data, id });
  }

  @Patch()
  update(@Body() data: UpdateHouseDTO) {
    return this.houseService.update(data);
  }

  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.houseService.remove(id);
  }

  @Delete()
  remove(@Body() data: House | UpdateHouseDTO) {
    return this.houseService.remove(data.id);
  }
}
