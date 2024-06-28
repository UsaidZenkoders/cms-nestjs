import { Module } from '@nestjs/common';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageService } from './chat-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { Student } from 'src/students/entities/student.entity';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ChatMessage,Student,Teacher])],
  controllers: [ChatMessageController],
  providers: [ChatMessageService,StudentsService,TeachersService,ImageUploadService]
})
export class ChatMessageModule {}
