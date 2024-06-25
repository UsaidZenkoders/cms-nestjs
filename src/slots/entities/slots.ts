import { Appointment } from 'src/appointment/entities/appointment';
import { SlotStatus } from 'src/enum/slot-status.enum';
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
  @Column({ type: 'time' })
  start_time: string;
  @Column()
  duration: string;
  @Column({ type: 'timestamp' })
  created_at: Date;
  @Column({ type: 'timestamp' })
  updated_at: Date;
  @Column({ type: 'date' })
  date: Date;
  @Column({
    type: 'enum',
    enum: SlotStatus,
    default: SlotStatus.available,
  })
  status: SlotStatus;
  @ManyToOne(() => Teacher, (teacher) => teacher.slots)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;
}
