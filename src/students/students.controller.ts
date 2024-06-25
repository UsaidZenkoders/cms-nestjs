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
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { CreateAppointmentDto } from 'src/appointment/dto/create-appointment.dto';
import { AppointmentService } from 'src/appointment/appointment.service';
import { SlotsService } from 'src/slots/slots.service';
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Roles(Role.student)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly enrolmentService: EnrolmentService,
    private readonly studentService: StudentsService,
    private readonly appointmentService: AppointmentService,
    private readonly slotService: SlotsService,
  ) {}

  @Post('/addEnrolment')
  Create(@Body(ValidationPipe) createEnrolmentDto: CreateEnrolmentDto) {
    return this.enrolmentService.Create(createEnrolmentDto);
  }
  @Post('/dropCourse')
  @HttpCode(HttpStatus.OK)
  Drop(@Body(ValidationPipe) dropCourseDto: DropCourseDto) {
    return this.enrolmentService.DropCourse(dropCourseDto);
  }
  @Post('/getEnrolmentsbyEmail')
  @HttpCode(HttpStatus.OK)
  Post(@Body('email') email: string) {
    return this.enrolmentService.GetAllEnrolments(email);
  }
  @Patch('/updateProfile')
  UpdateProfile(
    @Param('email') email: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.updateStudentProfile(email, updateStudentDto);
  }

  @Get('/viewProfile/:email')
  async ViewProfile(@Param('email') email: string) {
    return await this.studentService.ViewProfileDetails(email);
  }

  @Post('/updateStudentImage')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async UpdatePicture(
    @Param('email') email: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.studentService.UpdateImage(email, image);
  }
  @Post('/createAppointment')
  async CreateAppointment(
    @Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto,
  ) {
    return await this.appointmentService.Create(createAppointmentDto);
  }
  @Get('/getallSlots')
  async GetAllSlots(
  ) {
  return await this.slotService.getAllSlots()
  }
  @Get('/getSlotbyId/:id')
  async GetSlotbyId(@Param('id',ParseIntPipe) id:number
  ) {
  return await this.slotService.getSlotbyId(id)
  }
}
