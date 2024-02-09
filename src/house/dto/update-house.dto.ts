import { PartialType } from '@nestjs/mapped-types';
import { CreateHouseDto } from './create-house.dto';

export class UpdateHouseDto extends PartialType(CreateHouseDto) {}
