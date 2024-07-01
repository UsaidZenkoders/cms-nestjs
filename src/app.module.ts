import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { AdminModule } from './admin/admin.module';
import { TeachersModule } from './teachers/teachers.module';
import { AuthModule } from './auth/auth.module';
import { Student } from './students/entities/student.entity';
import { Teacher } from './teachers/entities/teacher.entity';
import { Admin } from './admin/entities/admin.entity';
import { WhitelistModule } from './whitelist/whitelist.module';
import { whitelist } from './whitelist/entities/whitelist.entity';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/entities/course.entity';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { BcryptService } from './bcrypt/bcrypt.service';
import { OtpModule } from './otp/otp.module';
import { MailModule } from './mail/mail.module';
import { Otp } from './otp/entities/otp.entity';
import { Emails } from './emails/entity/emails.entity';
import { Enrolment } from './enrolment/entities/enrolment.entity';
import { EnrolmentModule } from './enrolment/enrolment.module';
import { AppointmentModule } from './appointment/appointment.module';
import { Appointment } from './appointment/entities/appointment';

import { ChatRoomModule } from './chat-room/chat-room.module';
import { MessageModule } from './message/message.module';
import { ChatRoom } from './chat-room/entities/chat-room.entity';
import { Messages } from './message/entities/message.entity';
import { StripeModule } from './stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
@Module({

  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'usaid12.zenkoders',
      database: 'cms',
      entities: [
        Student,
        Teacher,
        Admin,
        whitelist,
        Course,
        Otp,
        Enrolment,
        Emails,
        Appointment,
        ChatRoom,
        Messages,
      ],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal:true
    }),

    StudentsModule,
    AdminModule,
    TeachersModule,
    AuthModule,
    WhitelistModule,
    CoursesModule,
    ImageUploadModule,
    OtpModule,
    MailModule,
    EnrolmentModule,
    AppointmentModule,
    ChatRoomModule,
    MessageModule,
    StripeModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService, BcryptService],
})
export class AppModule {}
