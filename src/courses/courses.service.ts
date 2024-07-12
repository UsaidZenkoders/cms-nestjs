import {
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
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { PaginationSearchDto } from 'src/students/dto/pagination-seach.dto';
import { StripeService } from 'src/stripe/stripe.service';
import { Student } from 'src/students/entities/student.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private CourseRepository: Repository<Course>,
    @InjectRepository(Teacher) private TeacherRepository: Repository<Teacher>,
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
    @InjectRepository(Enrolment)
    private EnrolmentRepository: Repository<Enrolment>,
    private readonly stripeService: StripeService,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    try {
      const alreadyExist = await this.CourseRepository.findOneBy({
        code: createCourseDto.code,
      });
      const teacherWithId = await this.TeacherRepository.findOneBy({
        email: createCourseDto.teacher_id,
      });
      if (!teacherWithId) {
        throw new BadRequestException('Teacher doesnot exist');
      }
      if (alreadyExist) {
        return {
          message: 'Course already exist',
        };
      }
      if (new Date(createCourseDto.deadline) < new Date()) {
        throw new BadRequestException(
          'Deadline must be greater than current date',
        );
      }
      const addedCourse = this.CourseRepository.create({
        ...createCourseDto,
        teacher_id: teacherWithId,
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
  async getAllCourses(paginationSearchDto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationSearchDto;
      const query = this.CourseRepository.createQueryBuilder('course');

      if (search) {
        query.where('course.code LIKE :search OR course.name LIKE :search', {
          search: `%${search}%`,
        });
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
  async getCourseByCode(code: string) {
    try {
      const coursebyId = await this.CourseRepository.findOne({
        where: {
          code,
        },
      });
      if (!coursebyId) {
        throw new NotFoundException('Course doesnot exist');
      }
      return coursebyId;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const teacherId = await this.TeacherRepository.findOneBy({
        email: updateCourseDto.teacher_id,
      });
      if (!teacherId) {
        throw new Error('Teacher doesnot exist');
      }
      const course = await this.CourseRepository.findOneBy({
        code: id,
        teacher_id: teacherId,
      });
      if (course) {
        return this.CourseRepository.save({ ...course, updateCourseDto });
      }
      throw new NotFoundException('Course doesnot exist');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteCourse(id: string, email: string) {
    try {
      if (!email) {
        throw new BadRequestException('Please pass the email as query param');
      }
      const teacherId = await this.TeacherRepository.findOneBy({
        email: email,
      });
      if (!teacherId) {
        throw new Error('Teacher doesnot exist');
      }
      const courseExist = await this.CourseRepository.findOneBy({
        code: id,
        teacher_id: teacherId,
      });
      if (courseExist.code && new Date(courseExist.deadline) > new Date()) {
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
        throw new BadRequestException(
          'Either course doesnot exist or the deadline has passed',
        );
      }

      throw new BadRequestException('Course doesnot exist');
    } catch (error) {
      throw new InternalServerErrorException(error.messsage);
    }
  }
  async BuyCourse(course_code: string, email: string) {
    const courseExist = await this.CourseRepository.findOne({
      where: {
        code: course_code,
      },
    });

    const {id} = await this.stripeService.createProductPrice(
      course_code,
      courseExist.price,
    );

    if (!id) {
      throw new Error('Error in generating price ');
    }
    const { code, name, description, price, type } = courseExist;
    const stringedPrice = price.toString();
    console.log(stringedPrice)
    const courseDetails = {
      code,
      name,
      description,
      type,
      email,
      stringedPrice,
    };
    const session = await this.stripeService.createCheckoutSession(
      id,
      courseDetails,
    );

    return session;
  }

  async SubscribeCourse(course_code: string, email: string) {
    const courseExist = await this.CourseRepository.findOne({
      where: {
        code: course_code,
      },
    });
    const { code, name, description, price, type } = courseExist;
    const stringedPrice = price.toString();
    console.log(stringedPrice)
    const courseDetails = {
      code,
      name,
      description,
      type,
      email,
      stringedPrice,
    };
    const session = await this.stripeService.createSubscriptionSession(
      courseDetails,
    );

    return session;
  }
}
