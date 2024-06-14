import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from 'src/students/dto/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Student)
    private StudentsRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private TeachersRepository: Repository<Teacher>,
    @InjectRepository(Admin)
    private AdminRepository: Repository<Admin>,
  ) {}
  async studentSignUp(createStudentDto: CreateStudentDto) {
    try {
      const alreadyExist = await this.StudentsRepository.findOneBy({
        email: createStudentDto.email,
      });
      console.log(alreadyExist);
      if (alreadyExist) {
        throw new HttpException(
          'Student already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const student = this.StudentsRepository.create({
        ...createStudentDto,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      this.StudentsRepository.save(student);
      return student;
    } catch (error) {
      console.log(error);
    }
  }
  async teacherSignup(createTeacherDto: CreateTeacherDto) {
    try {
      const alreadyExist = await this.TeachersRepository.findOneBy({
        email: createTeacherDto.email,
      });
      console.log(alreadyExist);
      if (alreadyExist) {
        throw new HttpException(
          'Teacher already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      const teacher = this.TeachersRepository.create({
        ...createTeacherDto,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      this.TeachersRepository.save(teacher);
      return teacher;
    } catch (error) {
      console.log(error);
    }
  }
  async adminSignup(createAdminDto: CreateAdminDto) {
    try {
      const alreadyExist = await this.AdminRepository.findOneBy({
        email: createAdminDto.email,
      });
      console.log(alreadyExist);
      if (alreadyExist) {
        throw new HttpException('Admin already exists', HttpStatus.BAD_REQUEST);
      }
      const admin = this.AdminRepository.create({
        ...createAdminDto,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      this.AdminRepository.save(admin);
      return admin;
    } catch (error) {
      console.log(error);
    }
  }
}
