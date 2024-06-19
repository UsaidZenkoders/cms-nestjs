import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryColumn()
  code: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column({ type: 'date' })
  deadline: Date;
  @Column({ type: 'timestamptz' })
  created_at: Date;
  @Column({ type: 'timestamptz' })
  updated_at: Date;
}
