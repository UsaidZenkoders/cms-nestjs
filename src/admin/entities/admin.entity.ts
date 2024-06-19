import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryColumn()
  email: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({ default: 'ADMIN' })
  role: string;
  @Column({ default: null })
  img: string;
  @Column()
  is_verified: boolean = false;
  @Column({ type: 'timestamptz' })
  created_at: Date;
  @Column({ type: 'timestamptz' })
  updated_at: Date;
}
