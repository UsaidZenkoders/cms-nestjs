import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EnrolmentStatus } from 'src/enum/enrolment-status.enum';

export class CreateEnrolmentDto {
  @IsEnum(EnrolmentStatus)
  @IsNotEmpty()
  status: EnrolmentStatus=EnrolmentStatus.active

  @IsNotEmpty()
  @IsString()
  course_code: string;

  @IsNotEmpty()
  @IsEmail()
  student_id: string;

}
