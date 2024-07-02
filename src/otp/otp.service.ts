import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Otp } from './entities/otp.entity';
import { MailService } from 'src/mail/mail.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
    @InjectRepository(Teacher) private TeacherRepository: Repository<Teacher>,
    @InjectRepository(Admin) private AdminRepository: Repository<Admin>,
    @InjectRepository(Otp) private OtpRepository: Repository<Otp>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async generateOtp(email: string): Promise<string> {
    try {
      const existingOtp = await this.OtpRepository.findOneBy({
        user_id: email,
      });
      if (existingOtp) {
        await this.OtpRepository.delete(existingOtp.id);
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      console.log(`Generated OTP for ${email}: ${otp}`);

      const FIVE_MINUTES = 5 * 60 * 1000
      const validTill = new Date(Date.now() + FIVE_MINUTES);

      const newOtp = this.OtpRepository.create({
        user_id: email,
        otp: otp,
        expiresAt: validTill,
        createdAt: new Date(),
        tries: 0,
      });
      await this.OtpRepository.save(newOtp);

      this.mailService.sendMail(email, otp);

      return otp;
    } catch (error) {
      console.error('Error generating otp:', error.message);
      throw new InternalServerErrorException('Error generating OTP');
    }
  }
  async verifyOtp(verifyOtpDto: VerifyOtpDto, entityType: string) {
    try {
      const otpRecord = await this.OtpRepository.findOne({
        where: { user_id: verifyOtpDto.user_id },
      });

      if (!otpRecord) {
        throw new BadRequestException('Invalid OTP');
      }

      if (otpRecord.expiresAt < new Date()) {
        throw new BadRequestException('Expired OTP, Register again');
      }

      otpRecord.tries += 1;
      await this.OtpRepository.save(otpRecord);

      if (otpRecord.tries > 3) {
        await this.OtpRepository.delete(otpRecord.id);
        throw new BadRequestException(
          'You have reached maximum tries, Register again',
        );
      }

      if (otpRecord.otp !== verifyOtpDto.otp) {
        throw new BadRequestException('Incorrect OTP');
      }

      let user: Student | Teacher | Admin;
      switch (entityType) {
        case 'student':
          user = await this.StudentRepository.findOneBy({
            email: verifyOtpDto.user_id,
          });
          if (!user) {
            throw new NotFoundException('Student not found');
          }
          user.is_verified = true;
          await this.StudentRepository.save(user);
          break;
        case 'teacher':
          user = await this.TeacherRepository.findOneBy({
            email: verifyOtpDto.user_id,
          });
          if (!user) {
            throw new NotFoundException('Teacher not found');
          }
          user.is_verified = true;
          await this.TeacherRepository.save(user);
          break;
        case 'admin':
          user = await this.AdminRepository.findOneBy({
            email: verifyOtpDto.user_id,
          });
          if (!user) {
            throw new NotFoundException('Admin not found');
          }
          user.is_verified = true;
          await this.AdminRepository.save(user);
          break;
        default:
          throw new BadRequestException('Invalid entity type');
      }

      await this.OtpRepository.delete(otpRecord.id);

      const payload = { email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);

      return {
        message: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} created and verified successfully`,
        access_token: token,
        user: {
          email: user.email,
          img: user.img,
        },
      };
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      throw new BadRequestException(error.message);
    }
  }
}
