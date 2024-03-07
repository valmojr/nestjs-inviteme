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
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import UserParser from 'src/util/UserParser';

@UseGuards(AuthGuard)
@Controller('house')
export class HouseController {
  constructor(
    private readonly houseService: HouseService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() data: House) {
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

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() data: House) {
    return this.houseService.update({ ...data, id });
  }

  @Patch()
  update(@Body() data: House) {
    return this.houseService.update(data);
  }

  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.houseService.remove(id);
  }

  @Delete()
  remove(@Body() data: string) {
    return this.houseService.remove(data);
  }
}
