import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { EnrolmentService } from 'src/enrolment/enrolment.service';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { Appointment } from 'src/appointment/entities/appointment';
import { MailService } from 'src/mail/mail.service';
import { StripeService } from 'src/stripe/stripe.service';
import { Payments } from 'src/payments/entities/payments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Enrolment,
      Student,
      Course,
      Teacher,
      Appointment,
      Payments
    ]),
  ],
  controllers: [StudentsController],
  providers: [
    StudentsService,
    EnrolmentService,
    ImageUploadService,
    AppointmentService,
    MailService,
    StripeService
  ],
})
export class StudentsModule {}
