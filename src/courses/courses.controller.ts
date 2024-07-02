import { Controller, Get, HttpCode, HttpStatus, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { PaginationSearchDto } from 'src/students/dto/pagination-seach.dto';

@UseGuards(AuthenticationGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CoursesService) {}
  @Get('')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllCourses(@Query() paginationSearchDto: PaginationSearchDto) {
    return await this.courseService.getAllCourses(paginationSearchDto);
  }
  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOnebyId(@Param('id') id:string) {
    return await this.courseService.getCourseByCode(id)
  }
}
