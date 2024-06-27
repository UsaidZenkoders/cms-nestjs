import { Appointment } from 'src/appointment/entities/appointment';
import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
@Entity()
export class Student {
  @PrimaryColumn()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  age: string;

  @Column()
  contact: string;

  @Column({ default: null })
  img: string;

  @Column({ default: 'STUDENT' })
  role: string;

  @Column({ default: false })
  is_suspended: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => Enrolment, (enrolment) => enrolment.student_id)
  enrolments: Enrolment;
  @OneToMany(() => Appointment, (appointments) => appointments.student_id)
  appointments: Appointment;
  @OneToMany(() => ChatMessage, (message) => message.senderStudent)
  sentMessages: ChatMessage;
  @OneToMany(() => ChatMessage, (message) => message.recieverStudent)
  reciveMessages: ChatMessage;
}
