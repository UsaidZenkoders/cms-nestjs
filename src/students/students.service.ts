import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { PaginationSearchDto } from './dto/pagination-seach.dto';
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
  ) {}
  async getAllStudents(paginationSearchDto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationSearchDto;
      const query = this.StudentRepository.createQueryBuilder('student');

      if (search) {
        query.where(
          'student.username LIKE :search OR student.email LIKE :search',
          { search: `%${search}%` },
        );
      }

      const [result, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        data: result,
        count: total,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
