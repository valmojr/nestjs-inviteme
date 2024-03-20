import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from '@prisma/client';
import { Request } from 'express';
import UserParser from '../util/UserParser';
import { JwtService } from '@nestjs/jwt';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() data: Role) {
    return this.roleService.create(data);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = UserParser(
      req.headers.authorization.split(' ')[1],
      this.jwtService,
    );
    return this.roleService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Role) {
    return this.roleService.update({ id, ...data });
  }

  @Patch()
  updateOne(@Body() data: Role) {
    return this.roleService.update(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Delete()
  removeOne(@Body() data: Role) {
    return this.roleService.remove(data);
  }
}
