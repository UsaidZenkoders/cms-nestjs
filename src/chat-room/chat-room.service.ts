import {
  BadRequestException,
  Injectable,
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
        return alreadyExist.id
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
      return roomId
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

 
}
