import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from 'src/payments/entities/payments.entity';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Payments,Student,Course,Enrolment])],
  controllers: [StripeController],
  providers: [StripeService]
})
export class StripeModule {}
