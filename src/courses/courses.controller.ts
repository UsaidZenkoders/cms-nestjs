import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@UseGuards(AuthenticationGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}

  @Get('/allCourses')
  @HttpCode(HttpStatus.OK)
  async GetAll() {
    return await this.courseService.getAllCourses();
  }
}
