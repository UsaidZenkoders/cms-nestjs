import { Course } from 'src/courses/entities/course.entity';
import { EnrolmentStatus } from 'src/enum/enrolment-status.enum';
import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Enrolment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'enum',
    enum: EnrolmentStatus,
    default: EnrolmentStatus.active,
  })
  status: EnrolmentStatus;
  @Column({ type: 'timestamptz' })
  created_at: Date;

  // MANY ENROLMENTS BELONG TO ONE COURSE
  @ManyToOne(() => Course, (course) => course.enrolments)
  @JoinColumn({ name: 'course_code' })
  course_code: Course;

  // MANY ENROLMENTS BELONG TO ONE STUDENT
  @ManyToOne(() => Student, (student) => student.enrolments)
  @JoinColumn({ name: 'student_id' })
  student_id: Student;
}
