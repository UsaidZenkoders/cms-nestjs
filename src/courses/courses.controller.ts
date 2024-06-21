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
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}



  @Roles(Role.teacher)
  @Post('/addCourse')
  async Create(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }



  @Get('/allCourses')
  @HttpCode(HttpStatus.OK)
  async GetAll() {
    return await this.courseService.getAllCourses();
  }


  @Roles(Role.admin)
  @Patch(':id')
  async Update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.updateCourse(id, updateCourseDto);
  }

  
  @Roles(Role.admin)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.courseService.deleteCourse(id);
  }
}
