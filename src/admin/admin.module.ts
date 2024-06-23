import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { whitelist } from 'src/whitelist/entities/whitelist.entity';
import { WhitelistService } from 'src/whitelist/whitelist.service';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesService } from 'src/courses/courses.service';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { TeachersService } from 'src/teachers/teachers.service';
import { StudentsService } from 'src/students/students.service';
import { Student } from 'src/students/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, whitelist, Enrolment, Teacher, Student]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    WhitelistService,
    CoursesService,
    TeachersService,
    StudentsService,
  ],
})
export class AdminModule {}
