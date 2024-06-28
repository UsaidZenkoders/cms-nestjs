import { AppointmentStatus } from 'src/enum/appointment-status.enum';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  created_at: string;
  @Column({ type: 'time' })
  start_time: Date;
  @Column({ type: 'date' })
  date: Date;
  @Column({ type: 'time' })
  end_time: Date;
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.pending,
  })
  status: AppointmentStatus;
  @ManyToOne(() => Student, (student) => student.appointments)
  @JoinColumn({ name: 'student_id' })
  student_id: Student;
  @ManyToOne(() => Teacher, (teacher) => teacher.appointments)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;
}
