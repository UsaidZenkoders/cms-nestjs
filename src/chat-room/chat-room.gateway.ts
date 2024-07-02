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
import { BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { EmailsService } from 'src/emails/emails.service';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';

@WebSocketGateway()
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatRoomService: ChatRoomService,

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
      const roomId =
        await this.chatRoomService.createChatRoom(createChatRoomDto);
      console.log(roomId);
      console.log('Room:', roomId);
      const socketId = socket.id;
      console.log('Socket ID:', socketId);
      socket.join(roomId);
      console.log(`${socketId} has joined room ${roomId}`);
      const messages=await this.messageService.getAllMessages(roomId)
      console.log(messages)
      socket.emit("message",{
        history:messages
      })
      
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
      const senderExist = await this.emailsService.getEmails(
        createMessageDto.senderId,
      );
      const receiverExist = await this.emailsService.getEmails(
        createMessageDto.receiverId,
      );
      if (!senderExist || !receiverExist) {
        throw new BadRequestException('Invalid sender or reciever');
      }
      const Createdmessage = await this.messageService.createMessage(createMessageDto);

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
    client.emit('error', { message: error.message || 'Unknown error' });
  }
}
