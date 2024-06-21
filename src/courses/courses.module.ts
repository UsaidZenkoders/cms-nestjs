import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course,Enrolment,Teacher])],
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}
