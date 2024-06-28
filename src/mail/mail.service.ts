import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface AppointmentDetails {
  student_id: string;
  slot_detail: {
    start_time: Date;
    end_time: Date;
    date: Date;
  };
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
      const { student_id, slot_detail } = details;
      this.mailerService.sendMail({
        to: email,
        from: 'usaid12.zenkoders@gmail.com',
        subject: 'Appointment Details',
        text: 'Please view the details',
        html: `<p>Requested by  <b>${student_id}<b></p><br>
          <b> Slot Details</b><br>
          Date: <b>${slot_detail.date}<b><br>
          Starting At: <b>${slot_detail.start_time}<b><br>
          Ending At: <b>${slot_detail.end_time}<b><br>
         `,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  sendAppointmentStatusMail(email: string, message: string) {
    try {
      this.mailerService.sendMail({
        to: email,
        from: 'usaid12.zenkoders@gmail.com',
        subject: 'Appointment Confirmation',
        text: 'Please view the details',
        html: `Response: <b>${message}<b>
         `,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
