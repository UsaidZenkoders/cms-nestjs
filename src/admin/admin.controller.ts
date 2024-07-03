import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Delete,
  Patch,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { PaginationSearchDto } from 'src/students/dto/pagination-seach.dto';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { CreateWhiteListDto } from 'src/whitelist/dto/create-whitelist.dto';
import { WhitelistService } from 'src/whitelist/whitelist.service';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto';
import { CoursesService } from 'src/courses/courses.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('admin')
@Roles(Role.admin)
export class AdminController {
  constructor(
    private readonly whitelistService: WhitelistService,
    private readonly teacherService: TeachersService,
    private readonly studentService: StudentsService,
    private readonly adminService: AdminService,
    private readonly courseService: CoursesService,
    private readonly appointmentService: AppointmentService,
    private readonly enrolmentService: EnrolmentService,
  ) {}

  @Patch('/updateProfilePicture')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async UpdatePicture(
    @LoggedInUser() email: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.adminService.UpdateImage(email, image);
  }
  @Post('/addDomain')
  Add(
    @Body(ValidationPipe)
    createWhiteListDto: CreateWhiteListDto,
  ) {
    return this.whitelistService.create(createWhiteListDto);
  }
  @Post('/addCourse')
  async Create(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @Patch('/course/:id')
  async UpdateCourse(
    @Param('id') id: string,

    @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.updateCourse(id, updateCourseDto);
  }

  @Delete('/course/:id')
  async delete(@Param('id') id: string, @Query('email') email: string) {
    return await this.courseService.deleteCourse(id, email);
  }

  @Get('/allStudents')
  @UsePipes(new ValidationPipe({ transform: true }))
  findAllStudents(@Query() paginationSearchDto: PaginationSearchDto) {
    return this.studentService.getAllStudents(paginationSearchDto);
  }
  @Get('/allTeachers')
  @UsePipes(new ValidationPipe({ transform: true }))
  findAllTeachers(@Query() paginationSearchDto: PaginationSearchDto) {
    return this.teacherService.getAllTeachers(paginationSearchDto);
  }
  @Get('/allAppointments')
  @UsePipes(new ValidationPipe({ transform: true }))
  findAllAppointments(@Query() paginationSearchDto: PaginationSearchDto) {
    return this.appointmentService.getAllAppointments(paginationSearchDto);
  }
  @Get('/allEnrolments')
  @UsePipes(new ValidationPipe({ transform: true }))
  findAllEnrolments(@Query() paginationSearchDto: PaginationSearchDto) {
    return this.enrolmentService.getAllEnrolments(paginationSearchDto);
  }
  @Post('/suspendStudent/:email')
  SuspendStudent(@Param('email') email: string) {
    return this.adminService.SuspendStudent(email);
  }
  @Post('/suspendTeacher/:email')
  SuspendTeacher(@Param('email') email: string) {
    return this.adminService.SuspendTeacher(email);
  }
  @Get('/viewProfile')
  async ViewProfile(@LoggedInUser() email: string) {
    return await this.adminService.ViewProfileDetails(email);
  }
  @Patch('/updateProfile')
  async UpdateProfile(
    @LoggedInUser() email: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return await this.studentService.updateStudentProfile(
      email,
      updateAdminDto,
    );
  }
}
