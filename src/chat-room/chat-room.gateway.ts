import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageService } from 'src/message/message.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { AddUserDto } from './dto/add-user.dto';
import {
  BadRequestException,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoom } from './entities/chat-room.entity';
import { EmailsService } from 'src/emails/emails.service';

interface User {
  id: string;
  name: string;
  roomId: string;
}

@WebSocketGateway()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: User[] = [];

  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    private readonly messageService: MessageService,
    private readonly chatRoomService: ChatRoomService,
    private readonly emailsService: EmailsService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const user = this.removeUser(client.id);
    console.log('Disconnected User');
    if (user) {
      this.server.to(user.roomId).emit('message', {
        user: 'admin',
        text: `${user.name} has left the chat`,
      });
    }
  }

  @SubscribeMessage('join')
  async handleJoinRoom(
    @MessageBody() data: AddUserDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const roomExist = await this.chatRoomService.findOnebyId(data.roomId);
      if (!roomExist) {
        throw new NotFoundException('Room doesnot exist');
      }
      const userExist = await this.emailsService.getEmails(data.userId);
      if (!userExist) {
        throw new BadRequestException('User doesnot exist');
      }
      const { name, roomId } = data;
      console.log('Room:', roomId);
      const socketId = socket.id;
      console.log('Socket ID:', socketId);
      await this.addUser(data, socketId);

      socket.join(roomId);
      console.log('Joined room:', roomId);

      this.server
        .to(roomId)
        .emit('message', { user: 'admin', text: `${name} has joined` });
      this.server
        .to(roomId)
        .emit('roomData', { roomId, users: this.getUsersInRoom(roomId) });

      this.server.to(socket.id).emit('joinConfirmation', { roomId });

      return { event: 'joinedRoom', data: roomId };
    } catch (error) {
      this.handleError(error, socket);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = this.getUser(client.id);
      console.log('User', user);
      if (user) {
        const message =
          await this.messageService.createMessage(createMessageDto);
        this.server
          .to(user.roomId)
          .emit('message', { user: user.name, text: message.message });
      } else {
        throw new BadRequestException('user doesnot exist or not connected');
      }
    } catch (error) {
      this.handleError(error, client);
    }
  }

  private async addUser({ name, roomId }: AddUserDto, id: string) {
    name = name.trim().toLowerCase();
    roomId = roomId.trim().toLowerCase();

    const existingUser = this.users.find(
      (user) => user.name === name && user.roomId === roomId,
    );

    if (existingUser) {
      return { error: 'User already exists' };
    }

    const user = { id, name, roomId };
    this.users.push(user);

    const chatRoom = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      relations: ['teacher_id', 'student_id'],
    });
    if (!chatRoom) {
      throw new NotFoundException('room doesnot exist');
    }

    return { user };
  }

  private removeUser(id: string) {
    const index = this.users.findIndex((user) => user.id === id);

    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
  }

  private getUser(id: string) {
    return this.users.find((user) => user.id === id);
  }

  private getUsersInRoom(room: string) {
    return this.users.filter((user) => user.roomId === room);
  }
  private handleError(client: Socket, error: any) {
    client.emit('error', { message: error.message || 'Unknown error' });
  }
}
