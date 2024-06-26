import { IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  student_id: string;
  @IsNotEmpty()
  teacher_id: string;
  @IsNotEmpty()
  start_time: string;
  @IsNotEmpty()
  date: string;
  @IsNotEmpty()
  end_time: string;
}
