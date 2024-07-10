import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnrolmentStatus } from 'src/enum/enrolment-status.enum';

export class CreateEnrolmentDto {
  @IsNotEmpty()
  @IsEmail()
  student_id: string;
  @IsNotEmpty()
  @IsString()
  course_code: string;

}
