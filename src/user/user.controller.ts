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
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body()
    data: User,
  ) {
    return this.userService.create(data);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('partial/:username')
  findPartial(@Param('username') username: string) {
    return this.userService.findPartial(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() updateUserDto: User) {
    return this.userService.update(updateUserDto);
  }

  @Patch()
  update(@Body() updateUserDto: User) {
    return this.userService.update(updateUserDto);
  }

  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Delete()
  remove(@Body() user: User) {
    return this.userService.remove(user.id);
  }
}
