import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { PaginationSearchDto } from 'src/students/dto/pagination-seach.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ImageUploadService } from 'src/image-upload/image-upload.service';

@Injectable()
export class TeachersService {
  
  constructor(
    @InjectRepository(Teacher) private TeacherRepository: Repository<Teacher>,
    private readonly imageUploadService: ImageUploadService,
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
      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const previousPage = page > 1 ? page - 1 : null;

      return {
        data: result,
        count: total,
        totalPages,
        currentPage: page,
        nextPage,
        previousPage,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updateTeacherProfile(
    email: string,
    updateTeacherDto: UpdateTeacherDto,
  ) {
    try {
      const teacher = await this.TeacherRepository.findOneBy({ email: email });
      console.log(teacher);
      const updatedTeacher = await this.TeacherRepository.save({
        ...teacher,
        ...updateTeacherDto,
      });

      return {
        message: 'Teacher Updated Successfully',
        UpdatedTeacher: updatedTeacher,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async UpdateImage(email: string, image: Express.Multer.File) {
    const teacher = await this.TeacherRepository.findOneBy({
      email: email,
    });
    if (!teacher) {
      throw new BadRequestException('Student doesnot exist');
    }
    const imageUrl = await this.imageUploadService.uploadImage(image);
    await this.TeacherRepository.save({ ...teacher, img: imageUrl });
  }
  async findOnebyId(email:string){
    const teacher = await this.TeacherRepository.findOne({
      where: {
        email:email
      },
    });
    if (!teacher){
      throw new BadRequestException("Teacher doesnot exist")
    }
    return teacher
  }
}
