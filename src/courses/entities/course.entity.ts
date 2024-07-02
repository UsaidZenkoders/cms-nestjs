import { Cart } from 'src/cart/entities/cart.entity';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { CourseStatus } from 'src/enum/course-status.enum';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryColumn()
  code: string;
  @Column()
  name: string;
  @Column()
  description: string;

  @Column({ type: 'date' })
  deadline: Date;
  @Column({ type: 'timestamptz' })
  created_at: Date;
  @Column({ type: 'timestamptz' })
  updated_at: Date;
  @OneToMany(() => Enrolment, (enrolment) => enrolment.course_code)
  enrolments: Enrolment;
  @ManyToOne(() => Teacher, (teacher) => teacher.courses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;
}
