import { ChatRoom } from 'src/chat-room/entities/chat-room.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  created_at: string;
  @Column()
  senderId: string;
  @Column()
  receiverId: string;
  @Column()
  message: string;
  @ManyToOne(() => ChatRoom, (room) => room.messages)
  @JoinColumn({ name: 'roomId' })
  roomId: ChatRoom;
}
