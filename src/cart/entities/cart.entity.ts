import { Course } from 'src/courses/entities/course.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Course, (course) => course.cart)
  @JoinColumn({ name: 'course_code' })
  course_code: Course;
}
