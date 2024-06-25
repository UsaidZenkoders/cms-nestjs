import { IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  student_id: string;
  @IsNotEmpty()
  teacher_id: string;
  @IsNotEmpty()
  slot_id: number;
}
