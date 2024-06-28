import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CreateChatMessageDto } from './dto/create-message.dto';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { getFormattedDate } from 'src/helpers/Date-formatter';
import { Chat } from 'src/chat/entities/chat.entity';

@Injectable()
@WebSocketGateway()
export class ChatMessageService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(ChatMessage)
    private ChatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(Chat)
    private ChatRepository: Repository<Chat>,
    private readonly StudentService: StudentsService,
    private readonly TeacherService: TeachersService,
  ) {}
  @WebSocketServer()
  server: Socket;

  handleConnection(client: Socket) {
    this.server.emit('user-joined', {
      message: `User has joined ${client.id}`,
    });
  }
  handleDisconnect(client: any) {
    this.server.emit('user-left', {
      message: `User has joined ${client.id}`,
    });
  }

  @SubscribeMessage('sendmessage')
  async handleSendMessage(
    @MessageBody() createChatMessageDto: CreateChatMessageDto,
  ) {
    try {
      let senderStudent: Student | Teacher | undefined;
      let sendeTeacher: Student | Teacher | undefined;
      let receiverStudent: Student | Teacher | undefined;
      let recieverTeacher: Student | Teacher | undefined;

      if (
        createChatMessageDto.senderStudentId &&
        createChatMessageDto.recieverTeacherId
      ) {
        senderStudent = await this.StudentService.findOnebyId(
          createChatMessageDto.senderStudentId,
        );

        console.log(senderStudent);
        recieverTeacher = await this.TeacherService.findOnebyId(
          createChatMessageDto.recieverTeacherId,
        );
      } else if (
        createChatMessageDto.senderTeacherId &&
        createChatMessageDto.recieverStudentId
      ) {
        sendeTeacher = await this.TeacherService.findOnebyId(
          createChatMessageDto.senderTeacherId,
        );
        recieverTeacher = await this.StudentService.findOnebyId(
          createChatMessageDto.recieverStudentId,
        );
      }

      if (!createChatMessageDto.message) {
        throw new BadRequestException('Message cannot be null');
      }
      const chat=await this.ChatRepository.create({
        messages
      })

      const formattedDate = getFormattedDate();
      console.log('Formatted Date', formattedDate);
      const chatData = this.ChatMessageRepository.create({
        ...createChatMessageDto,
        senderStudent: senderStudent || null,
        senderTeacher: sendeTeacher || null,
        recieverStudent: receiverStudent || null,
        recieverTeacher: recieverTeacher || null,
        created_at: formattedDate,
      });

      await this.ChatMessageRepository.save(chatData);

      this.server.emit('onmessage', {
        message: 'New Message',
        body: chatData,
      });

      return chatData;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
}
