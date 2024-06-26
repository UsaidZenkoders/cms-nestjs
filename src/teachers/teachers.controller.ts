import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto';
import { Roles } from 'src/decorators/role.decorator';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teachers.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppointmentStatusDto } from 'src/appointment/dto/appointment-status.dto.';
import { AppointmentService } from 'src/appointment/appointment.service';

@Roles(Role.teacher)
@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly enrolmentsService: EnrolmentService,
    private readonly courseService: CoursesService,
    private readonly teacherService: TeachersService,
    private readonly appointmentService: AppointmentService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('/teachersEnrolment')
  async getEnrolmentsbyEmail(@Body('email') email: string) {
    return await this.enrolmentsService.GetAllEnrolmentsWithTeacher(email);
  }

  @Post('/addCourse')
  async Create(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @Patch('/updateCourse/:id')
  async UpdateCourse(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.updateCourse(id, updateCourseDto);
  }

  @Delete('/deleteCourse/:id')
  async delete(@Param('id') id: string, @Body() email: string) {
    return await this.courseService.deleteCourse(id, email);
  }

  @Patch('/updateProfile/:email')
  @HttpCode(HttpStatus.OK)
  UpdateProfile(
    @Param('email') email: string,
    @Body(ValidationPipe) updatedTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.updateTeacherProfile(email, updatedTeacherDto);
  }

  @Post('/updateTeacherImage')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async UpdatePicture(
    @Param('email') email: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.teacherService.UpdateImage(email, image);
  }

  @Post('/approveRejectAppointment/:id')
  async approveRejectAppointment(
    @Param('id',ParseIntPipe) id:number,
    @Body(ValidationPipe) appointmentStatusDto: AppointmentStatusDto,
  ) {
    return await this.appointmentService.ApproveRejectAppointment(
      appointmentStatusDto,id
    );
  }
}
