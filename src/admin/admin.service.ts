import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
  ) {}
  async SuspendStudent(email: string) {
    try {
      const studenttobeSuspended = await this.StudentRepository.findOneBy({
        email,
      });
      if (!studenttobeSuspended) {
        return new BadRequestException('Student doesnot exist');
      }
      await this.StudentRepository.update(
        { email: email },
        { is_suspended: true },
      );
      return {
        message:"Student suspended successfully",
        SuspendedStudent:studenttobeSuspended
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
