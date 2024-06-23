import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrolment, Student, Course, Teacher])],
  controllers: [StudentsController],
  providers: [StudentsService, EnrolmentService],
})
export class StudentsModule {}
