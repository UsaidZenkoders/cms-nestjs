import { IsMilitaryTime, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from 'src/enum/appointment-status.enum';

export class AppointmentStatusDto {
  @IsNotEmpty()
  student_id: string;
  @IsNotEmpty()
  teacher_id: string;

  status: AppointmentStatus;
  @IsNotEmpty()
  @IsMilitaryTime()
  start_time: Date;

  @IsNotEmpty()
  @IsMilitaryTime()
  end_time: Date;
}
