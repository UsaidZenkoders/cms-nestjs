import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginStudentDto } from 'src/students/dto/login-student.dto';
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
  ) {}
  async studentSignUp(createStudentDto: CreateStudentDto) {
    try {
      const alreadyExist = await this.StudentsRepository.findOneBy({
        email: createStudentDto.email,
      });
      if (alreadyExist) {
        return {
          message: 'Student already exists',
          status: HttpStatus.CONFLICT,
        };
      } else {
        const { password } = createStudentDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const payload = {
          email: createStudentDto.email,
          role: createStudentDto.role,
        };
        const token = this.jwtService.sign(payload);
        const student = this.StudentsRepository.create({
          ...createStudentDto,
          password: hashedPassword,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        });
        this.StudentsRepository.save(student);

        return {
          message: 'Student created successfully',
          access_token: token,
          student: createStudentDto,
          status: HttpStatus.CREATED,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async teacherSignup(createTeacherDto: CreateTeacherDto) {
    try {
      const alreadyExist = await this.TeachersRepository.findOneBy({
        email: createTeacherDto.email,
      });
      if (alreadyExist) {
        return {
          message: 'Teacher already exists',
          status: HttpStatus.CONFLICT,
        };
      }
      const { password } = createTeacherDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const payload = {
        email: createTeacherDto.email,
        role: createTeacherDto.role,
      };
      const token = this.jwtService.sign(payload);
      const teacher = this.TeachersRepository.create({
        ...createTeacherDto,
        password: hashedPassword,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      this.TeachersRepository.save(teacher);
      return {
        message: 'Teacher created successfully',
        access_token: token,
        teacher: createTeacherDto,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async adminSignup(createAdminDto: CreateAdminDto) {
    try {
      const alreadyExist = await this.AdminRepository.findOneBy({
        email: createAdminDto.email,
      });
      if (alreadyExist) {
        return {
          message: 'Admin already exists',
          status: HttpStatus.BAD_REQUEST,
        };
      }
      const admin = this.AdminRepository.create({
        ...createAdminDto,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      const payload = {
        email: createAdminDto.email,
        role: createAdminDto.role,
      };
      const token = this.jwtService.sign(payload);
      this.AdminRepository.save(admin);
      return {
        message: 'Admin created successfully',
        access_token: token,
        admin: createAdminDto,
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async studentLogin(loginStudentDto: LoginStudentDto) {
    const userwithEmail = await this.StudentsRepository.findOneBy({
      email: loginStudentDto.email,
    });

    if (userwithEmail) {
      const { password } = loginStudentDto;
      const dbPass = (await userwithEmail).password;
      const matchedPassword = bcrypt.compare(password, dbPass);
      if (matchedPassword) {
        const payload = {
          email: loginStudentDto.email,
          role: loginStudentDto.role,
        };
        const token = this.jwtService.sign(payload);
        return {
          message: 'Login successful',
          access_token: token,
        };
      }
      return {
        message: 'Invalid credentials ',
        status: HttpStatus.UNAUTHORIZED,
      };
    }
    return {
      message: 'Invalid credentials ',
      status: HttpStatus.UNAUTHORIZED,
    };
  }
}
