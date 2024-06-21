import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Teacher } from './entities/teacher.entity';

@Module({
  controllers: [TeachersController],
  providers: [TeachersService,EnrolmentService]
})
export class TeachersModule {}
