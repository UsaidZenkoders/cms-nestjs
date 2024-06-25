import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/courses/dto/update-course.dto';
import { Roles } from 'src/decorators/role.decorator';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Role } from 'src/enum/role.enum';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teachers.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSlotDto } from 'src/slots/dto/create-slot.dto';
import { SlotsService } from 'src/slots/slots.service';
import { UpdateSlotDto } from 'src/slots/dto/update-slot.dto';

@Roles(Role.teacher)
@Controller('teachers')
export class TeachersController {
  constructor(
    private readonly enrolmentsService: EnrolmentService,
    private readonly courseService: CoursesService,
    private readonly teacherService: TeachersService,
    private readonly slotService: SlotsService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('/teachersEnrolment')
  async getEnrolmentsbyEmail(@Body('email') email: string) {
    return await this.enrolmentsService.GetAllEnrolmentsWithTeacher(email);
  }

  @Post('/addCourse')
  async Create(@Body(ValidationPipe) createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @Patch('/updateCourse/:id')
  async UpdateCourse(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCourseDto: UpdateCourseDto,
  ) {
    return await this.courseService.updateCourse(id, updateCourseDto);
  }

  @Delete('/deleteCourse/:id')
  async delete(@Param('id') id: string, @Body() email: string) {
    return await this.courseService.deleteCourse(id, email);
  }

  @Patch('/updateProfile/:email')
  @HttpCode(HttpStatus.OK)
  UpdateProfile(
    @Param('email') email: string,
    @Body(ValidationPipe) updatedTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.updateTeacherProfile(email, updatedTeacherDto);
  }

  @Post('/updateTeacherImage')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async UpdatePicture(
    @Param('email') email: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.teacherService.UpdateImage(email, image);
  }
  @Post('/createSlot')
  async CreateSlot(@Body(ValidationPipe) createSlotDto: CreateSlotDto) {
    return await this.slotService.Create(createSlotDto);
  }
  @Patch('/updateSlot/:id')
  @HttpCode(HttpStatus.OK)
  async UpdateSlot(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSlotDto: UpdateSlotDto,
  ) {
    console.log(updateSlotDto);
    return await this.slotService.updateSlot(id, updateSlotDto);
  }
  @Delete('/deleteSlot/:id')
  async deleteSlot(@Param('id',ParseIntPipe) id: number, @Query('email') email: string) {
    return await this.slotService.deleteSlotbyId(id, email);
  }
}
