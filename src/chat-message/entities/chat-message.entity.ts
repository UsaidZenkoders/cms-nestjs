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
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  message: string;
  @Column({ type: 'timestamptz' })
  created_at: Date;
  @ManyToOne(() => Student, (student) => student.studentSent, {
    nullable: true,
  })
  @JoinColumn({ name: 'senderStudent' })
  senderStudent: Student;
  @ManyToOne(() => Student, (student) => student.studentrecieve, {
    nullable: true,
  })
  @JoinColumn({ name: 'recieverStudent' })
  recieverStudent: Student;
  @ManyToOne(() => Teacher, (teacher) => teacher.teacherSent, {
    nullable: true,
  })
  @JoinColumn({ name: 'senderTeacher' })
  senderTeacher: Teacher;
  @ManyToOne(() => Teacher, (teacher) => teacher.teacherrecieve, {
    nullable: true,
  })
  @JoinColumn({ name: 'recieverTeacher' })
  recieverTeacher: Teacher;
}
