import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateChatMessageDto } from './dto/create-message.dto';
import { ChatMessageService } from './chat-message.service';

@Controller('chat-message')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}
  @Post('/createMessage')
  async sendMessage(
    @Body(ValidationPipe) createChatMessageDto: CreateChatMessageDto,
  ) {
    return await this.chatMessageService.handleSendMessage(
      createChatMessageDto,
    );
  }
}
