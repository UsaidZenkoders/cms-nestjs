import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  message_id: string;

  @Column({ type: 'timestamptz' })
  created_at: Date;
}
