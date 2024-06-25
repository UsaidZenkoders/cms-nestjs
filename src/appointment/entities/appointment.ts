import { AppointmentStatus } from 'src/enum/appointment-status.enum';
import { Slots } from 'src/slots/entities/slots';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'timestamptz' })
  created_at: Date;
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
  @OneToOne(() => Slots)
  @JoinColumn({ name: 'slot_id' })
  slot_id: Slots;
}
