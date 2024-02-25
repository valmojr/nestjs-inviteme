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
import { HouseService } from './house.service';
import { House } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Post()
  create(@Body() data: House) {
    return this.houseService.create(data);
  }

  @Get()
  findAll() {
    return this.houseService.findAll();
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
