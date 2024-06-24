import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { EnrolmentStatus } from 'src/enum/enrolment-status.enum';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { DropCourseDto } from './dto/drop-course.dto';

@Injectable()
export class EnrolmentService {
  constructor(
    @InjectRepository(Enrolment)
    private EnrolmentRepository: Repository<Enrolment>,
    @InjectRepository(Student)
    private StudentRepository: Repository<Student>,
    @InjectRepository(Course)
    private CourseRepository: Repository<Course>,
    @InjectRepository(Teacher)
    private TeacherRepository: Repository<Teacher>,
  ) {}

  async Create(createEnrolmentDto: CreateEnrolmentDto) {
    const studentwithId = await this.StudentRepository.findOneBy({
      email: createEnrolmentDto.student_id,
    });
    const coursewithCode = await this.CourseRepository.findOneBy({
      code: createEnrolmentDto.course_code,
    });
    if (!studentwithId) {
      throw new BadRequestException('Student with this id doesnot exist');
    }
    if (!coursewithCode) {
      throw new BadRequestException('Course doesnot exist');
    }
    const alreadyEnrolledStudent = await this.EnrolmentRepository.findOneBy({
      course_code: coursewithCode,
      student_id: studentwithId,
    });
    console.log(alreadyEnrolledStudent);
    if (alreadyEnrolledStudent) {
      throw new BadRequestException(
        'Student is already enrolled in this course',
      );
    }

    if (new Date(coursewithCode.deadline) < new Date()) {
      throw new BadRequestException('Deadline has been passed');
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
  async GetAllEnrolments(email: string) {
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
    return {
      enrolments,
    };
  }
  async GetAllEnrolmentsWithTeacher(teacherEmail: string) {
    try {
      const studentsEnrolled =
        await this.EnrolmentRepository.createQueryBuilder('enrolment')
          .innerJoinAndSelect('enrolment.course_code', 'course')
          .innerJoin('course.teacher_id', 'teacher')
          .innerJoinAndSelect('enrolment.student_id', 'student')
          .where('teacher.email = :teacherEmail', {
            teacherEmail: teacherEmail,
          })
          .getMany();

      if (!studentsEnrolled || studentsEnrolled.length === 0) {
        throw new BadRequestException(
          'No students enrolled in courses taught by this teacher',
        );
      }
      const transformedEnrolments = studentsEnrolled.map((enrolments) => ({
        enrolment: {
          id: enrolments.id,
          status: enrolments.status,
          created_at: enrolments.created_at.toISOString().split('T')[0],
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
