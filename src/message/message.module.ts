import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from 'src/chat-room/entities/chat-room.entity';
import { Emails } from 'src/emails/entity/emails.entity';
import { Messages } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Emails, Messages])],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
