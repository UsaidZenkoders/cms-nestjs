import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { PaginationSearchDto } from 'src/students/dto/pagination-seach.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher) private TeacherRepository: Repository<Teacher>,
  ) {}
  async getAllTeachers(paginationSearchDto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationSearchDto;
      const query = this.TeacherRepository.createQueryBuilder('teacher');

      if (search) {
        query.where(
          'teacher.username LIKE :search OR teacher.email LIKE :search',
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
