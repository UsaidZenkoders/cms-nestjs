import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto';
import { Roles } from 'src/decorators/role.decorator';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';

@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly enrolmentsService: EnrolmentService,
    private readonly courseService: CoursesService,
  ) {}
  @Roles(Role.teacher)
  @HttpCode(HttpStatus.OK)
  @Post('/teachersEnrolment')
  async getEnrolmentsbyEmail(@Body('email') email: string) {
    return await this.enrolmentsService.GetAllEnrolmentsWithTeacher(email);
  }
  @Roles(Role.teacher)
  @Post('/addCourse')
  async Create(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }
  @Roles(Role.teacher)
  @Patch('/updateCourse/:id')
  async Update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.updateCourse(id, updateCourseDto);
  }

  @Roles(Role.teacher)
  @Delete('/deleteCourse/:id')
  async delete(@Param('id') id: string, @Body() email: string) {
    return await this.courseService.deleteCourse(id, email);
  }
}
