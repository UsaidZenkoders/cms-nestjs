import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private CourseRepository: Repository<Course>,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    try {
      const alreadyExist = await this.CourseRepository.findOneBy({
        code: createCourseDto.code,
      });
      if (alreadyExist) {
        return {
          message: 'Course already exist',
          code: alreadyExist.code,
          status: HttpStatus.CONFLICT,
        };
      }
      if (new Date(createCourseDto.deadline) < new Date()) {
        throw new BadRequestException(
          'Deadline must be greater than current date',
        );
      }
      const addedCourse = this.CourseRepository.create({
        ...createCourseDto,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await this.CourseRepository.save(addedCourse);

      return {
        message: 'Course Created Successfully',
        course: addedCourse,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
  async getAllCourses() {
    try {
      const courses = await this.CourseRepository.find();
      if (courses.length >= 1) {
        return {
          courses,
        };
      }
      throw new NotFoundException('No course to show');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const course = await this.CourseRepository.findOneBy({
        code: id,
      });
      if (course) {
        return this.CourseRepository.save({ ...course, updateCourseDto });
      }
      throw new NotFoundException('Course doesnot exist');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteCourse(id: string) {
    try {
      const courseExist = await this.CourseRepository.findOneBy({ code: id });
      if (courseExist.code) {
        const removedCourse = await this.CourseRepository.delete(
          courseExist.code,
        );
        if (removedCourse.affected >= 1) {
          return {
            message: 'Course deleted successfully ',
            course: courseExist.code,
            status: HttpStatus.OK,
          };
        }
        throw new BadRequestException('An error occured while deleting');
      }

      throw new BadRequestException('Course doesnot exist');
    } catch (error) {
      throw new InternalServerErrorException(error.messsage);
    }
  }
}