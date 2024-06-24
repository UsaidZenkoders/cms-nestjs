import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { PaginationSearchDto } from './dto/pagination-seach.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
    private imageUploadService: ImageUploadService,
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
  async updateStudentProfile(
    email: string,
    updateStudentDto: UpdateStudentDto,
  ) {
    try {
      const student = await this.StudentRepository.findOneBy({ email: email });
      console.log(student);
      const updatedStudent = await this.StudentRepository.save({
        ...student,
        ...updateStudentDto,
      });

      return {
        message: 'Student Updated Successfully',
        student: updatedStudent,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async ViewProfileDetails(email: string) {
    const studentProfile = await this.StudentRepository.findOneBy({
      email: email,
    });

    return { student: studentProfile };
  }
  async UpdateImage(email: string, image: Express.Multer.File) {
    const Student = await this.StudentRepository.findOneBy({
      email: email,
    });
    if (!Student) {
      throw new BadRequestException('Student doesnot exist');
    }
    const imageUrl = await this.imageUploadService.uploadImage(image);
    await this.StudentRepository.save({ ...Student, img: imageUrl });
  }
}
