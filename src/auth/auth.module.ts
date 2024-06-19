import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { whitelist } from 'src/whitelist/entities/whitelist.entity';
import { WhitelistService } from 'src/whitelist/whitelist.service';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { OtpService } from 'src/otp/otp.service';
import { Otp } from 'src/otp/entities/otp.entity';
import { MailService } from 'src/mail/mail.service';
import { EmailsService } from 'src/emails/emails.service';
import { Emails } from 'src/emails/entity/emails.entity';
import { whitelistingGuard } from 'src/guards/whitelisting.guard';
// import { MulterMiddleware } from 'src/middlewares/multer.middleware';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Teacher, Admin, whitelist, Otp, Emails]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60000s' },
    }),
  ],
  providers: [
    whitelistingGuard,
    AuthService,
    WhitelistService,
    ImageUploadService,
    BcryptService,
    OtpService,
    MailService,
    EmailsService,
  ],
  controllers: [AuthController],
})
export class AuthModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(MulterMiddleware)
  //     .forRoutes(
  //       { path: 'auth/student/register', method: RequestMethod.POST },
  //       { path: 'auth/admin/register', method: RequestMethod.POST },
  //       { path: 'auth/teacher/register', method: RequestMethod.POST },
  //     );
  // }
}
