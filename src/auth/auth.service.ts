/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginStudentDto } from 'src/students/dto/login-student.dto';
import { LoginTeacherDto } from 'src/teachers/dto/login-teacher.dto';
import { LoginAdminDto } from 'src/admin/dto/login-admin.dto';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { OtpService } from 'src/otp/otp.service';
import { VerifyOtpDto } from 'src/otp/dto/verify-otp.dto';
import { EmailsService } from 'src/emails/emails.service';
import { WhitelistService } from 'src/whitelist/whitelist.service';
import { Role } from 'src/enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Student)
    private StudentsRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private TeachersRepository: Repository<Teacher>,
    @InjectRepository(Admin)
    private AdminRepository: Repository<Admin>,
    private jwtService: JwtService,
    private imageUploadService: ImageUploadService,
    private bcryptService: BcryptService,
    private otpService: OtpService,
    private EmailService: EmailsService,
    private whitelistService: WhitelistService,
  ) {}
  async studentSignUp(
    createStudentDto: CreateStudentDto,
    image: Express.Multer.File,
  ) {
    try {
      const existingUnverifiedStudent = await this.StudentsRepository.findOne({
        where: { email: createStudentDto.email, is_verified: false },
      });

      if (existingUnverifiedStudent) {
        const otp = await this.otpService.generateOtp(createStudentDto.email);
        return {
          message:
            'A registration with this email is in progress. Please check your email for verification instructions.',
          otpSent: true,
        };
      }
      const alreadyExist = await this.EmailService.getEmails(
        createStudentDto.email,
        true,
      );
      if (alreadyExist) {
        throw new ConflictException('Email has already been taken');
      }
      const allowedDomain = await this.whitelistService.validateDomain(
        createStudentDto.email,
      );
      if (!allowedDomain) {
        throw new Error('This domain is not allowed');
      }

      const imageUrl = await this.imageUploadService.uploadImage(image);

      const { password } = createStudentDto;
      const hashedPassword = await this.bcryptService.hash(password, 10);
      const otp = await this.otpService.generateOtp(createStudentDto.email);
      this.EmailService.createEmail(createStudentDto.email, 'STUDENT');
      const student = this.StudentsRepository.create({
        ...createStudentDto,
        password: hashedPassword,
        img: imageUrl,
        created_at: new Date(),
        updated_at: new Date(),
        is_verified: false,
      });
      await this.StudentsRepository.save(student);
      return {
        message: 'Otp sent to email. Please verify to complete registration',
        otpSent: true,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }
  async studentOtpVerification(verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyOtpDto, 'student');
  }

  async teacherSignup(
    createTeacherDto: CreateTeacherDto,
    image: Express.Multer.File,
  ) {
    try {
      const existingUnverifiedTeacher = await this.TeachersRepository.findOne({
        where: { email: createTeacherDto.email, is_verified: false },
      });

      if (existingUnverifiedTeacher) {
        const otp = await this.otpService.generateOtp(createTeacherDto.email);
        return {
          message:
            'A registration with this email is in progress. Please check your email for verification instructions.',
          otpSent: true,
        };
      }

      const alreadyExist = await this.EmailService.getEmails(
        createTeacherDto.email,
        true,
      );
      if (alreadyExist) {
        throw new ConflictException('Email has already been taken');
      }
      const allowedDomain = await this.whitelistService.validateDomain(
        createTeacherDto.email,
      );
      if (!allowedDomain) {
        throw new Error('This domain is not allowed');
      }
      const imageUrl = await this.imageUploadService.uploadImage(image);

      const { password } = createTeacherDto;
      const hashedPassword = await this.bcryptService.hash(password, 10);
      const otp = await this.otpService.generateOtp(createTeacherDto.email);
      this.EmailService.createEmail(createTeacherDto.email, 'TEACHER');
      const teacher = this.TeachersRepository.create({
        ...createTeacherDto,
        password: hashedPassword,
        img: imageUrl,
        created_at: new Date(),
        updated_at: new Date(),
        is_verified: false,
      });
      await this.TeachersRepository.save(teacher);
      return {
        message: 'Otp sent to email. Please verify to complete registration',
        otpSent: true,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }
  async teacherOtpVerification(verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyOtpDto, 'teacher');
  }
  async adminSignup(
    createAdminDto: CreateAdminDto,
    image: Express.Multer.File,
  ) {
    try {
      const existingUnverifiedAdmin = await this.AdminRepository.findOne({
        where: { email: createAdminDto.email, is_verified: false },
      });

      if (existingUnverifiedAdmin) {
        const otp = await this.otpService.generateOtp(createAdminDto.email);
        return {
          message:
            'A registration with this email is in progress. Please check your email for verification instructions.',
          otpSent: true,
        };
      }

      const alreadyExist = await this.EmailService.getEmails(
        createAdminDto.email,
        true,
      );
      if (alreadyExist) {
        throw new BadRequestException('Email has already been taken');
      }
      const allowedDomain = await this.whitelistService.validateDomain(
        createAdminDto.email,
      );
      if (!allowedDomain) {
        throw new Error('This domain is not allowed');
      }
      const imageUrl = await this.imageUploadService.uploadImage(image);

      const { password } = createAdminDto;
      const hashedPassword = await this.bcryptService.hash(password, 10);
      const otp = await this.otpService.generateOtp(createAdminDto.email);
      this.EmailService.createEmail(createAdminDto.email, 'ADMIN');
      const admin = this.AdminRepository.create({
        ...createAdminDto,
        password: hashedPassword,
        img: imageUrl,
        created_at: new Date(),
        updated_at: new Date(),
        is_verified: false,
      });
      await this.AdminRepository.save(admin);
      return {
        message: 'Otp sent to email. Please verify to complete registration',
        otpSent: true,
      };
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }
  async adminOtpVerification(verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyOtpDto, 'admin');
  }

  async studentLogin(loginStudentDto: LoginStudentDto) {
    const userwithEmail = await this.StudentsRepository.findOneBy({
      email: loginStudentDto.email,
    });
    if (!userwithEmail) {
      throw new UnauthorizedException('Student with this email doesnot exist');
    }
    if (userwithEmail && userwithEmail.is_verified) {
      const { password } = loginStudentDto;
      const dbPass = userwithEmail.password;
      const matchedPassword = await this.bcryptService.compare(
        password,
        dbPass,
      );
      if (matchedPassword) {
        const payload = {
          email: loginStudentDto.email,
          role: userwithEmail.role,
        };
        console.log(payload);
        const token = this.jwtService.sign(payload);
        return {
          message: 'Login successful',
          access_token: token,
        };
      }
      throw new UnauthorizedException('Invalid Credentials');
    }

    throw new UnauthorizedException('Student is not verified');
  }

  async teacherLogin(loginTeacherDto: LoginTeacherDto) {
    const userwithEmail = await this.TeachersRepository.findOneBy({
      email: loginTeacherDto.email,
    });
    if (!userwithEmail) {
      throw new UnauthorizedException('Teacher with this email doesnot exist');
    }
    if (userwithEmail && userwithEmail.is_verified) {
      const { password } = loginTeacherDto;
      const dbPass = userwithEmail.password;
      const matchedPassword = await this.bcryptService.compare(
        password,
        dbPass,
      );
      if (matchedPassword) {
        const payload = {
          email: loginTeacherDto.email,
          role: userwithEmail.role,
        };
        console.log(payload);
        const token = this.jwtService.sign(payload);
        return {
          message: 'Login successful',
          access_token: token,
        };
      }
      throw new UnauthorizedException('Invalid Credentials');
    }

    throw new UnauthorizedException('Teacher is not verified');
  }
  async adminLogin(loginAdminDto: LoginAdminDto) {
    const userwithEmail = await this.AdminRepository.findOneBy({
      email: loginAdminDto.email,
    });
    if (!userwithEmail) {
      throw new UnauthorizedException('Admin with this email doesnot exist');
    }
    if (userwithEmail && userwithEmail.is_verified) {
      const { password } = loginAdminDto;
      const dbPass = userwithEmail.password;
      const matchedPassword = await this.bcryptService.compare(
        password,
        dbPass,
      );
      if (matchedPassword) {
        const payload = {
          email: loginAdminDto.email,
          role: userwithEmail.role,
        };
        console.log(payload);
        const token = this.jwtService.sign(payload);
        return {
          message: 'Login successful',
          access_token: token,
        };
      }
      throw new UnauthorizedException('Invalid Credentials');
    }

    throw new UnauthorizedException('Admin is not verified');
  }
}
