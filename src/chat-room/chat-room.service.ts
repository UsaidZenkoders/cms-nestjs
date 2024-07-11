import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { Repository } from 'typeorm';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { getFormattedDate } from 'src/helpers/Date-formatter';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private ChatRoomRepository: Repository<ChatRoom>,
    private readonly studentService: StudentsService,
    private readonly teacherService: TeachersService,
  ) {}
  async createChatRoom(createChatRoomDto: CreateChatRoomDto) {
    try {
      const teacher = await this.teacherService.findOnebyId(
        createChatRoomDto.teacher_id,
      );
      const student = await this.studentService.findOnebyId(
        createChatRoomDto.student_id,
      );
      const alreadyExist = await this.ChatRoomRepository.findOne({
        where: { teacher_id: teacher, student_id: student },
        relations: ['student_id', 'teacher_id'],
      });
      if (alreadyExist) {
        return alreadyExist.id;
      }
      const formattedDate = getFormattedDate();
      const extractedTeacherEmail = createChatRoomDto.student_id.split('@')[0];
      const extractedStudentEmail = createChatRoomDto.teacher_id.split('@')[0];
      const roomId = extractedTeacherEmail + extractedStudentEmail;
      console.log(roomId);
      const room = this.ChatRoomRepository.create({
        student_id: student,
        teacher_id: teacher,
        created_at: formattedDate,
        id: roomId,
      });
      await this.ChatRoomRepository.save(room);
      return roomId;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  async canUserJoinChat({
    userId,
    chatId,
  }: {
    chatId: string;
    userId: string;
  }): Promise<boolean> {
    const chat = await this.ChatRoomRepository.findOne({
      where: { id:chatId },
      relations:{
        student_id:true,
        teacher_id:true
      }
    });
console.log(chat)
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    const isStudent = chat.student_id && chat.student_id.email === userId;
    const isTeacher = chat.teacher_id && chat.teacher_id.email === userId;
    return isStudent || isTeacher;
  }
}
