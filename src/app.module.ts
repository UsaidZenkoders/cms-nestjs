import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { PaymentsModule } from './payments/payments.module';
import { Payments } from './payments/entities/payments.entity';
import { JsonBodyMiddleware } from './middlewares/jsonbody.middleware';
import { RawBodyMiddleware } from './middlewares/rawBody.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
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
        Payments,
      ],
      synchronize: true,
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
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, BcryptService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: '/stripe/webhook',
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
