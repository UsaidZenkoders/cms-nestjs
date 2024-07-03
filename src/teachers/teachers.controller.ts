import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teachers.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppointmentStatusDto } from 'src/appointment/dto/appointment-status.dto.';
import { AppointmentService } from 'src/appointment/appointment.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles(Role.teacher)
@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly enrolmentsService: EnrolmentService,
    private readonly teacherService: TeachersService,
    private readonly appointmentService: AppointmentService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('/teachersEnrolment')
  async getEnrolmentsbyEmail(@LoggedInUser() email:string) {
    return await this.enrolmentsService.GetAllEnrolmentsWithTeacher(email);
  }

  @Patch('/updateProfile')
  @HttpCode(HttpStatus.OK)
  async UpdateProfile(
    @LoggedInUser() email:string,
    @Body(ValidationPipe) updatedTeacherDto: UpdateTeacherDto,
  ) {
    return await this.teacherService.updateTeacherProfile(
      email,
      updatedTeacherDto,
    );
  }

  @Post('/updateProfilePicture')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async UpdatePicture(
    @LoggedInUser() email:string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.teacherService.UpdateImage(email, image);
  }

  @Post('/approveRejectAppointment/:id')
  async approveRejectAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) appointmentStatusDto: AppointmentStatusDto,
  ) {
    return await this.appointmentService.ApproveRejectAppointment(
      appointmentStatusDto,
      id,
    );
  }

  @Get('/appointments')
  async getAppointments(@LoggedInUser() email:string) {
    return await this.appointmentService.getAppointmentsbyTeacherId(email);
  }
}
