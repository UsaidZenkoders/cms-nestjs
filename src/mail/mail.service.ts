import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  sendMail(email: string, otp: string) {
    try {
      this.mailerService.sendMail({
        to: email,
        from: 'usaid12.zenkoders@gmail.com',
        subject: 'OTP verification for signup',
        text: 'Please enter the otp to register',
        html: `<p>Your otp code is <b>${otp}<b></p><br><br><br><br>
          <b> NOTE: Do not share this code with anyone </b>`,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
