import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { CourseStatus } from 'src/enum/course-status.enum';
import { Payments } from 'src/payments/entities/payments.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryColumn()
  code: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column({nullable:true})
  price: number;
  @Column({ type: 'enum', enum: CourseStatus, default: CourseStatus.free })
  type: CourseStatus;
  @Column({ type: 'date' })
  deadline: Date;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @OneToMany(() => Payments, (payment) => payment.course_code)
  payments: Payments[];
  @OneToMany(() => Enrolment, (enrolment) => enrolment.course_code)
  enrolments: Enrolment;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;
}
