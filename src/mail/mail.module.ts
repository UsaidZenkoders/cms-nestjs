import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'usaida863@gmail.com',
          pass: 'jdla wgrh zunk xjtl',
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
