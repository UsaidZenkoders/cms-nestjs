import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { LoginStudentDto } from 'src/students/dto/login-student.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { LoginTeacherDto } from 'src/teachers/dto/login-teacher.dto';
import { LoginAdminDto } from 'src/admin/dto/login-admin.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
import { VerifyOtpDto } from 'src/otp/dto/verify-otp.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // STUDENT AUTH ROUTES

  @Post('/student/register')
  @UseInterceptors(FileInterceptor('image'))
  async createStudent(
    @Body(ValidationPipe) createStudentDto: CreateStudentDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.authService.studentSignUp(createStudentDto, image);
  }

  @Post('/student/register/verify-otp')
  async verifyOtpForStudent(
    @Body(ValidationPipe)
    verifyOtpDto: VerifyOtpDto,
  ) {
    return await this.authService.studentOtpVerification(verifyOtpDto);
  }

  @Post('/student/login')
  @Roles(Role.student)
  @UseGuards(AuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  async loginStudent(@Body(ValidationPipe) loginStudentDto: LoginStudentDto) {
    return await this.authService.studentLogin(loginStudentDto);
  }

  // ADMIN AUTH  ROUTES

  @Post('/admin/register')
  @UseInterceptors(FileInterceptor('image'))
  async createAdmin(
    @Body(ValidationPipe) createAdminDto: CreateAdminDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.authService.adminSignup(createAdminDto, image);
  }

  @Post('/admin/register/verify-otp')
  async verifyOtpForAdmin(
    @Body(ValidationPipe)
    verifyOtpDto: VerifyOtpDto,
  ) {
    return await this.authService.adminOtpVerification(verifyOtpDto);
  }


  @Post('/admin/login')
  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  async loginAdmin(@Body(ValidationPipe) loginAdminDto: LoginAdminDto) {
    return await this.authService.adminLogin(loginAdminDto);
  }

  // TEACHER AUTH ROUTES

  @Post('/teacher/register')
  @UseInterceptors(FileInterceptor('image'))
  async createTeacher(
    @Body(ValidationPipe) createTeacherDto: CreateTeacherDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.authService.teacherSignup(createTeacherDto, image);
  }

  @Post('/teacher/register/verify-otp')
  async verifyOtpForTeacher(
    @Body(ValidationPipe)
    verifyOtpDto: VerifyOtpDto,
  ) {
    return await this.authService.teacherOtpVerification(verifyOtpDto);
  }

  @Post('/teacher/login')
  @Roles(Role.teacher)
  @HttpCode(HttpStatus.OK)
  async loginTeacher(@Body(ValidationPipe) loginTeacherDto: LoginTeacherDto) {
    return await this.authService.teacherLogin(loginTeacherDto);
  }
}
