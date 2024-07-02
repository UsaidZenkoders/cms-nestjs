import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/chat-room/entities/chat-room.entity';

import { Repository } from 'typeorm';
import { Messages } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

import { Emails } from 'src/emails/entity/emails.entity';
import { getFormattedDate } from 'src/helpers/Date-formatter';

interface AllMessages {
  message: string;
}

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(ChatRoom)
    private ChatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Emails)
    private EmailRepository: Repository<Emails>,
    @InjectRepository(Messages)
    private MessagesRepository: Repository<Messages>,
  ) {}
  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      const roomExist = await this.ChatRoomRepository.findOne({
        where: { id: createMessageDto.roomId },
      });
      if (!roomExist) {
        throw new BadRequestException('Room doesnot exist');
      }
      const senderExist = await this.EmailRepository.findOne({
        where: { email: createMessageDto.senderId },
      });
      const recieverExist = await this.EmailRepository.findOne({
        where: { email: createMessageDto.receiverId },
      });
      console.log(recieverExist + 'reciever');
      if (!senderExist || !recieverExist) {
        throw new BadRequestException('User doesnot exist');
      }
      const formattedDate = getFormattedDate();
      const message = this.MessagesRepository.create({
        ...createMessageDto,
        roomId: roomExist,

        created_at: formattedDate,
      });
      return await this.MessagesRepository.save(message);
      
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }
  async getAllMessages(roomId: string){
    const roomwithId=await this.ChatRoomRepository.findOne({where:{id:roomId}})
    const allMessages = await this.MessagesRepository.find({
      where: { roomId: roomwithId },
    });
    if (!allMessages){
      return {
        message:"No message to show"
      }
    }
    return allMessages
  }
}
