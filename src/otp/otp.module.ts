import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Otp } from './entities/otp.entity';
import { MailService } from 'src/mail/mail.service';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Emails } from 'src/emails/entity/emails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Otp, Teacher, Admin,Emails])],
  controllers: [OtpController],
  providers: [OtpService, MailService],
})
export class OtpModule {}
