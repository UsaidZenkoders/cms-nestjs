import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { CreateEnrolmentDto } from 'src/enrolment/dto/create-enrolment.dto';
import { DropCourseDto } from 'src/enrolment/dto/drop-course.dto';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAppointmentDto } from 'src/appointment/dto/create-appointment.dto';
import { AppointmentService } from 'src/appointment/appointment.service';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles(Role.student)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly enrolmentService: EnrolmentService,
    private readonly studentService: StudentsService,
    private readonly appointmentService: AppointmentService,
  ) {}

  @Post('/enrolment/create')
  async Create(@Body(ValidationPipe) createEnrolmentDto: CreateEnrolmentDto) {
    return await this.enrolmentService.Create(createEnrolmentDto);
  }
  @Post('/enrolment/dropCourse')
  @HttpCode(HttpStatus.OK)
  async Drop(@Body(ValidationPipe) dropCourseDto: DropCourseDto) {
    return await this.enrolmentService.DropCourse(dropCourseDto);
  }
  @Get('/enrolment')
  @HttpCode(HttpStatus.OK)
  async Post(@LoggedInUser() email: string) {
    return await this.enrolmentService.getAllEnromentsbyId(email);
  }
  @Patch('/updateProfile/:email')
  async UpdateProfile(
    @LoggedInUser() email: string,
    @Body(ValidationPipe) updateStudentDto: UpdateStudentDto,
  ) {
    return await this.studentService.updateStudentProfile(
      email,
      updateStudentDto,
    );
  }

  @Get('/viewProfile')
  async ViewProfile(@LoggedInUser() email: string) {
    return await this.studentService.ViewProfileDetails(email);
  }

  @Patch('/updateProfilePicture')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async UpdatePicture(
    @UploadedFile() image: Express.Multer.File,
    @LoggedInUser() email: string,
  ) {
    return await this.studentService.UpdateImage(email, image);
  }
  @Post('/appointment/create')
  async CreateAppointment(
    @Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto,
  ) {
    return await this.appointmentService.Create(createAppointmentDto);
  }
  @Get('/appointments')
  async getAppointments(@LoggedInUser() email: string) {
    return await this.appointmentService.getAppointmentsbyStudentId(email);
  }
}
