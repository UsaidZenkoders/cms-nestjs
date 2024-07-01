import { Controller } from '@nestjs/common';

import { Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddUserDto } from './dto/add-user.dto';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { ChatGateway } from './chat-room.gateway';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { ChatRoomService } from './chat-room.service';

@Controller('chat-room')
export class ChatRoomController {
  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly chatRoomService: ChatRoomService,
  ) {}

}
