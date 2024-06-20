import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}
  @Post('/addCourse')
  async Create(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }
  @Get('/allCourses')
  @HttpCode(HttpStatus.OK)
  async GetAll() {
    return await this.courseService.getAllCourses();
  }
  @Patch(':id')
  async Update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.updateCourse(id, updateCourseDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.courseService.deleteCourse(id);
  }
}
