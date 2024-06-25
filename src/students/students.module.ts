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
import { Slots } from 'src/slots/entities/slots';
import { MailService } from 'src/mail/mail.service';
import { SlotsService } from 'src/slots/slots.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Enrolment,
      Student,
      Course,
      Teacher,
      Appointment,
      Slots
    ]),
  ],
  controllers: [StudentsController],
  providers: [
    StudentsService,
    EnrolmentService,
    ImageUploadService,
    AppointmentService,
    MailService,
    SlotsService
  ],
})
export class StudentsModule {}
