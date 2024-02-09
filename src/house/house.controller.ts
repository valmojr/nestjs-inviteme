import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HouseService } from './house.service';
import { House } from '@prisma/client';

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
  update(@Body() data: House) {
    return this.houseService.update(data);
  }

  @Patch()
  updateByBody(@Body() data: House) {
    return this.houseService.update(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.houseService.remove(id);
  }

  @Delete()
  removeByBody(@Body() data: string) {
    return this.houseService.remove(data);
  }
}
