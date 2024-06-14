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
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('/student')
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

  @Post('/teacher')
  createTeacher(
    @Body(ValidationPipe)
    createTeacherDto: CreateTeacherDto,
  ) {
    return this.authService.teacherSignup(createTeacherDto);
  }

  @Post('/admin')
  createAdmin(@Body(ValidationPipe) createAdminDto: CreateAdminDto) {
    return this.authService.adminSignup(createAdminDto);
  }
}
