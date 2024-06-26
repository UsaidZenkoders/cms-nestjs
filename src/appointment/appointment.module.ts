import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Student } from 'src/students/entities/student.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Teacher, Student])],
  controllers: [AppointmentController],
  providers: [AppointmentService, MailService],
})
export class AppointmentModule {}
