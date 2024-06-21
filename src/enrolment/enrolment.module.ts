import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { EnrolmentController } from './enrolment.controller';
import { EnrolmentService } from './enrolment.service';
import { Course } from 'src/courses/entities/course.entity';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Enrolment,Course,Student,Teacher])],
    controllers: [EnrolmentController],
    providers: [EnrolmentService],
})

export class EnrolmentModule {
    
}
