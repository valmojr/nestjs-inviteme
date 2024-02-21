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
import { GroupService } from './group.service';
import { Group } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: Group) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
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
