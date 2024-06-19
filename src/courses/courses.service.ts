import { HttpStatus, Injectable } from '@nestjs/common';
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
      const addedCourse = this.CourseRepository.create({
        ...createCourseDto,
        created_at: new Date(),
        updated_at: new Date(),
      });
      this.CourseRepository.save(addedCourse);
      return {
        message: 'Course Created Successfully',
        course: addedCourse,
        status: HttpStatus.CREATED,
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
          status: HttpStatus.OK,
        };
      }
      return {
        message: 'No course to show',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const course = await this.CourseRepository.findOneBy({
        code: updateCourseDto.code,
      });
      if (course.code) {
        return {
          message: 'Course Updated Successfully',
          ...this.CourseRepository,
          updateCourseDto,
        };
      }
      return {
        message: 'Course doesnot exist ',
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
  async deleteCourse(id: string) {
    try {
      const courseExist = await this.CourseRepository.findOneBy({ code: id });
      if (courseExist.code) {
        const removedCourse = this.CourseRepository.delete(courseExist);
        if ((await removedCourse).affected >= 1) {
          return {
            message: 'Course deleted successfully ',
            course: courseExist.code,
            status: HttpStatus.OK,
          };
        }
        return {
          message: 'An error occured while deleting',
        };
      }
      return {
        message: 'Course doesnot exist',
        status: HttpStatus.NOT_FOUND,
      };
    } catch (error) {
      return {
        error: error.message,
        status: HttpStatus.CONFLICT,
      };
    }
  }
}
