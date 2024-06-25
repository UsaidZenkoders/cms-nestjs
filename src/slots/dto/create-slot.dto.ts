import { IsDate, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateSlotDto {
  @IsNotEmpty()
  start_time: string;

  @IsNotEmpty()
  duration: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  teacher_id: string;

}
