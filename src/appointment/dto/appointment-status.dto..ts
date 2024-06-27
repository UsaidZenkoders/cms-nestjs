import { IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from 'src/enum/appointment-status.enum';

export class AppointmentStatusDto {
  @IsNotEmpty()
  student_id: string;
  @IsNotEmpty()
  teacher_id: string;

  status: AppointmentStatus;
  @IsNotEmpty()
  start_time: string;

  @IsNotEmpty()
  end_time: string;
}
