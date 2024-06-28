import { ChatMessage } from 'src/chat-message/entities/chat-message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(()=>ChatMessage,(message)=>message.message)
  messages: ChatMessage[];

  @Column({ type: 'timestamptz' })
  created_at: Date;
}
