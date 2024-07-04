import { Appointment } from 'src/appointment/entities/appointment';
import { ChatRoom } from 'src/chat-room/entities/chat-room.entity';
import { Enrolment } from 'src/enrolment/entities/enrolment.entity';
import { Payments } from 'src/payments/entities/payments.entity';
import { Entity, Column, PrimaryColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => Enrolment, (enrolment) => enrolment.student_id)
  enrolments: Enrolment;
  @OneToMany(() => Payments, (payment) => payment.student_id)
  payments: Payments;
  @OneToMany(() => Appointment, (appointments) => appointments.student_id)
  appointments: Appointment;
  @OneToMany(() => ChatRoom, (chat) => chat.student_id)
  chatRooms: ChatRoom;

  
}
