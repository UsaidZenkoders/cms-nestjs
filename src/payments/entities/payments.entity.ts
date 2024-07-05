import { Course } from 'src/courses/entities/course.entity';
import { PaymentStatus } from 'src/enum/payment-status.enum';
import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  session_id: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @Column()
  amount: number;
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.pending,
  })
  status: PaymentStatus;
  @ManyToOne(() => Student, (student) => student.payments)
  @JoinColumn({ name: 'student_id' })
  student_id: Student;
  @ManyToOne(() => Course, (course) => course.payments)
  @JoinColumn({ name: 'course_code' })
  course_code: Course;
}
