import { PartialType } from '@nestjs/mapped-types';
import { CreateSlotDto } from './create-slot.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateSlotDto extends PartialType(CreateSlotDto) {}
