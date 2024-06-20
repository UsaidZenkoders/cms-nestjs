import {
  BadRequestException,
  HttpStatus,
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
import { Emails } from 'src/emails/entity/emails.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
    @InjectRepository(Teacher) private TeacherRepository: Repository<Teacher>,
    @InjectRepository(Admin) private AdminRepository: Repository<Admin>,
    @InjectRepository(Otp) private OtpRepository: Repository<Otp>,
    @InjectRepository(Emails) private EmailRepository: Repository<Emails>,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async generateOtpforStudent(email: string): Promise<string> {
    try {
      const existingStudent = await this.StudentRepository.findOneBy({ email });
      if (existingStudent && existingStudent.is_verified) {
        throw new BadRequestException('Student with this email already exists');
      }

      const existingOtp = await this.OtpRepository.findOneBy({
        user_id: email,
      });
      if (existingOtp) {
        await this.OtpRepository.delete(existingOtp.id);
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      console.log(`Generated OTP for ${email}: ${otp}`);

      const validTill = new Date(Date.now() + 5 * 60 * 1000);
      const newOtp = this.OtpRepository.create({
        user_id: email,
        otp: otp,
        expiresAt: validTill,
        createdAt: new Date(),
      });
      await this.OtpRepository.save(newOtp);

      this.mailService.sendMail(email, otp);

      return otp;
    } catch (error) {
      console.error('Error generating otp:', error.message);
      throw new InternalServerErrorException('Error generating OTP');
    }
  }

  async verifyOtpforStudent(verifyOtpDto: VerifyOtpDto) {
    try {
      const otpRecord = await this.OtpRepository.findOne({
        where: { user_id: verifyOtpDto.user_id, otp: verifyOtpDto.otp },
      });
      const student = await this.StudentRepository.findOne({
        where: { email: verifyOtpDto.user_id },
      });

      if (!otpRecord) {
        throw new BadRequestException('Invalid OTP');
      }

      if (otpRecord.expiresAt < new Date()) {
        await this.StudentRepository.delete(student.email);
        await this.EmailRepository.delete(student.email);
        throw new BadRequestException('Expired OTP');
      }
      if (otpRecord.otp !== verifyOtpDto.otp) {
        await this.StudentRepository.delete(student.email);
        await this.EmailRepository.delete(student.email);
        throw new BadRequestException('Wrong Otp');
      }

      await this.OtpRepository.save(otpRecord);

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      student.is_verified = true;
      student.updated_at = new Date();

      await this.StudentRepository.save(student);
      await this.OtpRepository.delete(otpRecord.id);

      const payload = { email: student.email, role: student.role };
      const token = this.jwtService.sign(payload);

      return {
        message: 'Student created and verified successfully',
        access_token: token,
        student: {
          email: student.email,
          img: student.img,
        },
      };
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      throw new InternalServerErrorException('Error verifying OTP');
    }
  }

  async generateOtpForTeacher(email: string): Promise<string> {
    try {
      const existingTeacher = await this.TeacherRepository.findOneBy({ email });
      if (existingTeacher && existingTeacher.is_verified) {
        throw new BadRequestException('Teacher with this email already exists');
      }

      const existingOtp = await this.OtpRepository.findOneBy({
        user_id: email,
      });
      if (existingOtp) {
        await this.OtpRepository.delete(existingOtp.id);
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      console.log(`Generated OTP for ${email}: ${otp}`);

      const validTill = new Date(Date.now() + 5 * 60 * 1000);

      const newOtp = this.OtpRepository.create({
        user_id: email,
        otp: otp,
        expiresAt: validTill,
        createdAt: new Date(),
      });
      await this.OtpRepository.save(newOtp);

      this.mailService.sendMail(email, otp);

      return otp;
    } catch (error) {
      console.error('Error generating otp:', error.message);
      throw new InternalServerErrorException('Error generating OTP');
    }
  }
  async verifyOtpforTeacher(verifyOtpDto: VerifyOtpDto) {
    try {
      const otpRecord = await this.OtpRepository.findOne({
        where: { user_id: verifyOtpDto.user_id, otp: verifyOtpDto.otp },
      });
      const teacher = await this.TeacherRepository.findOne({
        where: { email: verifyOtpDto.user_id },
      });

      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }

      if (!otpRecord) {
        throw new BadRequestException('Incorrect Otp');
      }

      if (otpRecord.expiresAt < new Date()) {
        await this.TeacherRepository.delete(teacher.email);
        await this.EmailRepository.delete(teacher.email);
        throw new BadRequestException('Expired OTP');
      }
      // if (otpRecord.otp != verifyOtpDto.otp) {
      //   await this.TeacherRepository.delete(teacher.email);
      //   await this.EmailRepository.delete(teacher.email);
      //   throw new BadRequestException('Wrong Otp');
      // }

      await this.OtpRepository.save(otpRecord);

      teacher.is_verified = true;
      teacher.updated_at = new Date();

      await this.TeacherRepository.save(teacher);
      await this.OtpRepository.delete(otpRecord.id);

      const payload = { email: teacher.email, role: teacher.role };
      const token = this.jwtService.sign(payload);

      return {
        message: 'Teacher created and verified successfully',
        access_token: token,
        teacher: {
          email: teacher.email,
          img: teacher.img,
        },
      };
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      throw new InternalServerErrorException('Error verifying OTP');
    }
  }

  // ADMIN OTP LOGIC

  async generateOtpForAdmin(email: string): Promise<string> {
    try {
      const admin = this.AdminRepository.findOneBy({
        email: email,
      });
      if (!admin) {
        throw new Error('Admin doesnot exist');
      }
      const existingOtp = await this.OtpRepository.findOne({
        where: { user_id: email },
      });
      if (existingOtp) {
        await this.OtpRepository.delete(existingOtp.id);
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      console.log(otp);
      const validTill = new Date(Date.now() + 5 * 60 * 1000);
      console.log(validTill);
      const savedOtp = this.OtpRepository.create({
        user_id: email,
        otp: otp,
        expiresAt: validTill,
        createdAt: new Date(Date.now()),
      });
      this.OtpRepository.save(savedOtp);
      this.mailService.sendMail(email, otp);
      return otp;
    } catch (error) {
      console.error('Error generating otp');
      throw new Error(error.message);
    }
  }

  async verifyOtpforAdmin(verifyOtpDto: VerifyOtpDto) {
    try {
      const otpRecord = await this.OtpRepository.findOne({
        where: { user_id: verifyOtpDto.user_id, otp: verifyOtpDto.otp },
      });
      const admin = await this.AdminRepository.findOne({
        where: { email: verifyOtpDto.user_id },
      });

      if (!otpRecord) {
        throw new BadRequestException('Invalid OTP');
      }

      if (otpRecord.expiresAt < new Date()) {
        await this.AdminRepository.delete(admin.email);
        await this.EmailRepository.delete(admin.email);
        throw new BadRequestException('Expired OTP');
      }
      if (otpRecord.otp !== verifyOtpDto.otp) {
        await this.AdminRepository.delete(admin.email);
        await this.EmailRepository.delete(admin.email);
        throw new BadRequestException('Wrong Otp');
      }

      await this.OtpRepository.save(otpRecord);

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      admin.is_verified = true;
      admin.updated_at = new Date();

      await this.AdminRepository.save(admin);
      await this.OtpRepository.delete(otpRecord.id);

      const payload = { email: admin.email, role: admin.role };
      const token = this.jwtService.sign(payload);

      return {
        message: 'Admin created and verified successfully',
        access_token: token,
        admin: {
          email: admin.email,
          img: admin.img,
        },
      };
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      throw new InternalServerErrorException('Error verifying OTP');
    }
  }
}
