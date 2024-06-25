import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface AppointmentDetails {
  student_id: string;
  slot_id: number;
  
}
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
          <b> NOTE: Do not share this code with anyone </b>
          <b>NOTE: OTP is valid only for 5 minutes`,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  sendAppointmentMail(email: string, details: AppointmentDetails) {
    try {
      const { student_id, slot_id } = details;
      this.mailerService.sendMail({
        to: email,
        from: 'usaid12.zenkoders@gmail.com',
        subject: 'Appointment Details',
        text: 'Please view the details',
        html: `<p>FROM STUDENT<b>${student_id}<b></p><br><br><br><br>
          <b> REQUESTED SLOT ${slot_id} </b>
         `,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
