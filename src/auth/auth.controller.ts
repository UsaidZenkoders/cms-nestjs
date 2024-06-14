import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LoginStudentDto } from 'src/students/dto/login-student.dto';
import { UseGuards } from '@nestjs/common';
import { whitelistGuard } from 'src/guards/whitelist.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(whitelistGuard)
  @Post('/student/register')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const urlGenerator =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${urlGenerator}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  createStudent(
    @Body(ValidationPipe)
    createStudentDto: CreateStudentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    createStudentDto.img = `http://localhost:3000/uploads/${file.filename}`;

    return this.authService.studentSignUp(createStudentDto);
  }

  @Post("/student/login")
  loginStudent(
    @Body(ValidationPipe)
    loginStudentDto:LoginStudentDto
  ){
    return this.authService.studentLogin(loginStudentDto)
  }

  @Post('/teacher')
  createTeacher(
    @Body(ValidationPipe)
    createTeacherDto: CreateTeacherDto,
  ) {
    return this.authService.teacherSignup(createTeacherDto);
  }

  @UseGuards(whitelistGuard)
  @Post('/admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const urlGenerator =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${urlGenerator}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  createAdmin(@Body(ValidationPipe) createAdminDto: CreateAdminDto) {
    return this.authService.adminSignup(createAdminDto);
  }
}
