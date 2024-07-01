import { Messages } from 'src/message/entities/message.entity';
import { Student } from 'src/students/entities/student.entity';
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
export class ChatRoom {
  @PrimaryColumn()
  id: string;
  @Column()
  created_at: string;
  @ManyToOne(() => Teacher, (teacher) => teacher.chatRooms)
  @JoinColumn({ name: 'teacher_id' })
  teacher_id: Teacher;

  @ManyToOne(() => Student, (student) => student.chatRooms)
  @JoinColumn({ name: 'student_id' })
  student_id: Student;

  @OneToMany(() => Messages, (message) => message.roomId)
  messages: Messages[];
}
