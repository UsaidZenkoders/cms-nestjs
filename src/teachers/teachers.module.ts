import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Teacher } from './entities/teacher.entity';
import { CoursesService } from 'src/courses/courses.service';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { Slots } from 'src/slots/entities/slots';
import { SlotsService } from 'src/slots/slots.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrolment, Student, Course, Teacher, Slots]),
  ],
  controllers: [TeachersController],
  providers: [
    TeachersService,
    EnrolmentService,
    CoursesService,
    ImageUploadService,
    SlotsService,
  ],
})
export class TeachersModule {}
