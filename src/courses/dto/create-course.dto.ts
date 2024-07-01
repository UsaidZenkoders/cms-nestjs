import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CourseStatus } from 'src/enum/course-status.enum';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  code: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsEnum(CourseStatus)
  @IsNotEmpty()
  status: CourseStatus=CourseStatus.free
  @IsNotEmpty()
  @IsDateString()
  deadline: Date;
  @IsNotEmpty()
  @IsEmail()
  teacher_id: string;
}
