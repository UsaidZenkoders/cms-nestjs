import { Module } from '@nestjs/common';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { ChatGateway } from './chat-room.gateway';
import { Messages } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { Emails } from 'src/emails/entity/emails.entity';
import { EmailsService } from 'src/emails/emails.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, Student, Teacher, Messages, Emails]),
  ],
  controllers: [ChatRoomController],
  providers: [
    ChatRoomService,
    StudentsService,
    TeachersService,
    ImageUploadService,
    ChatGateway,
    MessageService,
    EmailsService,
  ],
})
export class ChatRoomModule {}
