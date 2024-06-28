import { Chat } from 'src/chat/entities/chat.entity';
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
  @Column()
  created_at: string;
  @ManyToOne(() => Student, (student) => student.sentMessages, {
    nullable: true,
  })
  @ManyToOne(() => Chat, (chat) => chat.messages, {
    nullable: true,
  })
  @JoinColumn({ name: 'chat_id' })
  chat_id: Chat;
  @ManyToOne(() => Student, (student) => student.reciveMessages, {
    nullable: true,
  })
  @JoinColumn({ name: 'recieverStudent' })
  recieverStudent: Student;
  @ManyToOne(() => Teacher, (teacher) => teacher.sentMessages, {
    nullable: true,
  })
  @JoinColumn({ name: 'senderTeacher' })
  senderTeacher: Teacher;
  @ManyToOne(() => Teacher, (teacher) => teacher.recieveMessages, {
    nullable: true,
  })
  @JoinColumn({ name: 'recieverTeacher' })
  recieverTeacher: Teacher;
}
