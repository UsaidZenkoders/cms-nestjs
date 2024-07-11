import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { EnrolmentStatus } from 'src/enum/enrolment-status.enum';
import { DropCourseDto } from './dto/drop-course.dto';
import { PaginationSearchDto } from 'src/students/dto/pagination-seach.dto';
import { CourseStatus } from 'src/enum/course-status.enum';
import { CoursesService } from 'src/courses/courses.service';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class EnrolmentService {
  constructor(
    @InjectRepository(Enrolment)
    private EnrolmentRepository: Repository<Enrolment>,
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,
    @InjectRepository(Course)
    private CourseRepository: Repository<Course>,
    private readonly courseService: CoursesService,
    private readonly studentService: StudentsService,
  ) {}

  async CreateEnrolment(createEnrolmentDto: CreateEnrolmentDto) {
    const coursewithCode = await this.courseService.getCourseByCode(
      createEnrolmentDto.course_code,
    );
    const studentwithId = await this.studentService.findOnebyId(
      createEnrolmentDto.student_id,
    );
    const enrolled = await this.EnrolmentRepository.findOne({
      where: {
       student_id:studentwithId,
       course_code:coursewithCode
      },
      relations: {
        student_id: true,
        course_code: true,
      },
    });
    console.log(enrolled);

    console.log(coursewithCode, studentwithId);

    if (coursewithCode.type === CourseStatus.free) {
      if (new Date(coursewithCode.deadline) < new Date()) {
        throw new BadRequestException('Deadline has passed');
      }

      const enrolment = this.EnrolmentRepository.create({
        student_id: studentwithId,
        course_code: coursewithCode,
        created_at: new Date(),
        status: EnrolmentStatus.active,
      });

      await this.EnrolmentRepository.save(enrolment);
      return {
        message: 'Student enrolled successfully',
        enrolment: {
          enrolmentId: enrolment.id,
          student: studentwithId,
          course: coursewithCode,
        },
      };
    }

    const session = await this.courseService.BuyCourse(
      createEnrolmentDto.course_code,
      createEnrolmentDto.student_id,
    );

    if (session.url) {
      return {
        message:
          'Checkout session created successfully , visit the url for payments',
        url: session.url,
      };
    }
    throw new BadRequestException('an error occured');
  }

  async getAllEnromentsbyId(email: string) {
    const studentwithId = await this.StudentRepository.findOneBy({
      email: email,
    });
    const enrolments = await this.EnrolmentRepository.find({
      where: { student_id: studentwithId },
    });
    if (!enrolments) {
      return {
        message: 'No enrolments to show',
      };
    }
    return enrolments;
  }
  async getAllEnrolments(paginationSearchDto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationSearchDto;
      const query = this.EnrolmentRepository.createQueryBuilder('enrolment');

      if (search) {
        query.where(
          'enrolment.course_code ILIKE :search OR enrolment.teacher_id ILIKE :search ',
          {
            search: `%${search}%`.toLowerCase(),
          },
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
  async GetAllEnrolmentsWithTeacher(teacherEmail: string) {
    try {
      // const teacher; //

      const studentsEnrolled =
        await this.EnrolmentRepository.createQueryBuilder('enrolment')
          .innerJoinAndSelect('enrolment.course_code', 'course')
          .innerJoin('course.teacher_id', 'teacher')
          .innerJoinAndSelect('enrolment.student_id', 'student')
          .where('teacher.email = :teacherEmail', {
            teacherEmail: teacherEmail,
          })
          .getMany();

      // await this.CourseRepository.find({
      //   where: {
      //     teacher_id: teacher.id,
      //   },
      //   select: {
      //     enrolments: {
      //       student_id: {
      //         username: true,
      //         email: true,
      //       },
      //     },
      //   },
      //   relations: {
      //     enrolments: {
      //       student_id: true,
      //     },
      //   },
      // });

      if (!studentsEnrolled || studentsEnrolled.length === 0) {
        throw new BadRequestException(
          'No students enrolled in courses taught by this teacher',
        );
      }
      const transformedEnrolments = studentsEnrolled.map((enrolments) => ({
        enrolment: {
          id: enrolments.id,
          status: enrolments.status,
          created_at: enrolments.created_at.toISOString(),
        },
        course_code: {
          code: enrolments.course_code.code,
          name: enrolments.course_code.name,
          description: enrolments.course_code.description,
          deadline: enrolments.course_code.deadline,
        },
        student_id: {
          email: enrolments.student_id.email,
          username: enrolments.student_id.username,
        },
      }));

      return {
        studentsEnrolled: transformedEnrolments,
      };
    } catch (error) {
      console.error('Error fetching students enrolled:', error);
      throw new BadRequestException(error.message);
    }
  }
  async DropCourse(dropCourseDto: DropCourseDto) {
    try {
      const studentExist = await this.StudentRepository.findOneBy({
        email: dropCourseDto.student_id,
      });
      if (!studentExist) {
        throw new BadRequestException('Student with this id doesnot exist');
      }
      const courseExist = await this.CourseRepository.findOneBy({
        code: dropCourseDto.course_code,
      });
      if (!courseExist) {
        throw new BadRequestException('Course doesnot exist');
      }
      if (courseExist && new Date(courseExist.deadline) < new Date()) {
        throw new BadRequestException('Deadline has passed');
      }
      const enrolmentExist = await this.EnrolmentRepository.findOneBy({
        student_id: studentExist,
        course_code: courseExist,
      });
      if (!enrolmentExist) {
        throw new BadRequestException('Student is not enrolled in this course');
      }
      const droppedCourse =
        await this.EnrolmentRepository.delete(enrolmentExist);

      if (droppedCourse.affected >= 1) {
        const { id, created_at } = enrolmentExist;
        const { course_code, student_id } = dropCourseDto;
        return {
          message: 'Course dropped successfully',
          DroppedCourse: {
            id,
            course_code,
            student_id,
            created_at,
          },
        };
      }
      return {
        message: 'Error in dropping course',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
