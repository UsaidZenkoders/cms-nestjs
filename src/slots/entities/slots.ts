import { Appointment } from 'src/appointment/entities/appointment';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Slots {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'timestamp' })
  start_time: Date;
  @Column({ type: 'timestamp' })
  end_time: Date;
  @Column({ type: 'timestamp' })
  created_at: Date;
  @Column({ type: 'timestamp' })
  updated_at: Date;
  @ManyToOne(() => Teacher, (teacher) => teacher.slots)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;
  @OneToMany(() => Appointment, (appointment) => appointment.slot_id)
  appointments: Appointment;
}
