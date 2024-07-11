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

import { MessageService } from 'src/message/message.service';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import {
  BadRequestException,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { EmailsService } from 'src/emails/emails.service';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@WebSocketGateway()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatRoomService: ChatRoomService,
    private readonly jwtService: JwtService,

    private readonly emailsService: EmailsService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() createChatRoomDto: CreateChatRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userToken = socket.handshake.headers.authorization.split(
        ' ',
      )[1] as string;

      const user = await this.jwtService.verify(userToken, {
        secret: jwtConstants.secret,
      });
      const requestedEmail = user.email;
      if (
        requestedEmail === createChatRoomDto.student_id ||
        requestedEmail === createChatRoomDto.teacher_id
      ) {
        const chatId =
          await this.chatRoomService.createChatRoom(createChatRoomDto);

        const canJoin = await this.chatRoomService.canUserJoinChat({
          userId: user.email,
          chatId,
        });

        if (canJoin) {
          socket.join(chatId);
          const socketId = socket.id;
          console.log(`${socketId} has joined room ${chatId}`);
          const messages = await this.messageService.getAllMessages(chatId);
          console.log(messages);
          socket.emit('message', {
            history: messages,
          });
          return;
        }
      }
      throw new UnauthorizedException(
        'You are not authorized to join this chat',
      );
    } catch (error) {
      console.log(error.message);
      this.handleError(socket, error);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const senderExist = await this.emailsService.getEmails(
        createMessageDto.senderId,
      );
      const receiverExist = await this.emailsService.getEmails(
        createMessageDto.receiverId,
      );
      if (!senderExist || !receiverExist) {
        throw new BadRequestException('Invalid sender or reciever');
      }
      const Createdmessage =
        await this.messageService.createMessage(createMessageDto);

      client.to(createMessageDto.roomId).emit('message', {
        sentby: createMessageDto.senderId,
        text: Createdmessage.message,
      });
    } catch (error) {
      console.log(error);
      console.log(client.id);
      this.handleError(error, client);
    }
  }

  private handleError(client: Socket, error: any) {
    console.log(client.id);
    client.emit('error', { message: error.message || 'Unknown error' });
  }
}
