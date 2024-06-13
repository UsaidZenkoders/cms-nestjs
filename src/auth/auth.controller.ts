import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { AuthService } from './auth.service';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/student')
  createStudent(
    @Body(ValidationPipe)
    createStudentDto: CreateStudentDto,
  ) {
    return this.authService.studentSignUp(createStudentDto);
  }

  @Post('/teacher')
  createTeacher(
    @Body(ValidationPipe)
    createTeacherDto: CreateTeacherDto,
  ) {
    return this.authService.teacherSignup(createTeacherDto);
  }
}
