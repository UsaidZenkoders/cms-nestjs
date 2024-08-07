import { IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
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
  @IsInt()
  @IsNotEmpty()
  price: number;
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
