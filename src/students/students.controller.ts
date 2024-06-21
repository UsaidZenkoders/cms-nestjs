import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { CreateEnrolmentDto } from 'src/enrolment/dto/create-enrolment.dto';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly EnrolmentService: EnrolmentService) {}
  @Roles(Role.student)
  @Post('/addEnrolment')
  Create(@Body(ValidationPipe) createEnrolmentDto: CreateEnrolmentDto) {
    return this.EnrolmentService.Create(createEnrolmentDto);
  }
}
