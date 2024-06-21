import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { Student } from 'src/students/entities/student.entity';
import { Course } from 'src/courses/entities/course.entity';
import { EnrolmentStatus } from 'src/enum/enrolment-status.enum';
import { NotFoundError } from 'rxjs';
import { Teacher } from 'src/teachers/entities/teacher.entity';
interface NewEnrolment {
  student_id: DeepPartial<Student>;
  course_code: DeepPartial<Course>;
}
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
    const alreadyEnrolledStudent = await this.EnrolmentRepository.findOneBy({
      course_code: coursewithCode,
      student_id: studentwithId,
    });
    if (alreadyEnrolledStudent) {
      throw new BadRequestException(
        'Student is already enrolled in this course',
      );
    }
    if (!studentwithId) {
      throw new BadRequestException('Student with this id doesnot exist');
    }
    if (!coursewithCode) {
      throw new BadRequestException('Course doesnot exist');
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
  async GetAllEnrolments() {
    const enrolments = await this.EnrolmentRepository.find();
    if (!enrolments) {
      return {
        message: 'No enrolments to show',
      };
    }
    return {
        enrolments
    }
  }
  async GetAllEnrolmentsWithTeacher(email:string){
   
    const teacher=await this.TeacherRepository.findOneBy({email})
    const courses=await this.CourseRepository.findBy({teacher_id:teacher})
    const enrolments=await this.EnrolmentRepository.findBy({course_code:courses})
    return {
        enrolments
    }
  }
}
