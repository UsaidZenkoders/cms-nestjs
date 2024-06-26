import { Appointment } from 'src/appointment/entities/appointment';
import { ChatRoom } from 'src/chat-room/entities/chat-room.entity';
import { Course } from 'src/courses/entities/course.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
@Entity()
export class Teacher {
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

  @Column()
  img: string = null;

  @Column({ default: 'TEACHER' })
  role: string;

  @Column({ default: false })
  is_suspended: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz' })
  updated_at: Date;
  @OneToMany(() => Course, (course) => course.teacher_id)
  courses: Course;
  @OneToMany(() => Appointment, (appointment) => appointment.teacher_id)
  appointments: Appointment;
  @OneToMany(() => ChatRoom, (chat) => chat.teacher_id)
  chatRooms: ChatRoom;
}
