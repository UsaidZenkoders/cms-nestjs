import { IsDateString, IsMilitaryTime, IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  student_id: string;
  @IsNotEmpty()
  teacher_id: string;
  @IsNotEmpty()
  @IsMilitaryTime({message:"Format should be hh-mm"})
  start_time: Date;
  @IsNotEmpty()
  @IsDateString()
  date: Date;
  @IsNotEmpty()
  @IsMilitaryTime()
  end_time: Date;
}
