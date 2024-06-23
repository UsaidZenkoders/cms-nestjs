import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { CreateEnrolmentDto } from 'src/enrolment/dto/create-enrolment.dto';
import { DropCourseDto } from 'src/enrolment/dto/drop-course.dto';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly enrolmentService: EnrolmentService) {}
  @Roles(Role.student)
  @Post('/addEnrolment')
  Create(@Body(ValidationPipe) createEnrolmentDto: CreateEnrolmentDto) {
    return this.enrolmentService.Create(createEnrolmentDto);
  }
  @Roles(Role.student)
  @Post('/dropCourse')
  @HttpCode(HttpStatus.OK)
  Drop(@Body(ValidationPipe) dropCourseDto: DropCourseDto) {
    return this.enrolmentService.DropCourse(dropCourseDto);
  }
  @Roles(Role.student)
  @Post('/getEnrolmentsbyEmail')
  @HttpCode(HttpStatus.OK)
  Get(@Body('email') email: string) {
    return this.enrolmentService.GetAllEnrolments(email);
  }
}
