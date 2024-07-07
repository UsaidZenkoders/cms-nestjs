import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { EnrolmentController } from './enrolment.controller';
import { EnrolmentService } from './enrolment.service';
import { Course } from 'src/courses/entities/course.entity';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { Payments } from 'src/payments/entities/payments.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrolment, Course, Student, Teacher, Payments]),
  ],
  controllers: [EnrolmentController],
  providers: [EnrolmentService, StripeService, MailService],
})
export class EnrolmentModule {}
