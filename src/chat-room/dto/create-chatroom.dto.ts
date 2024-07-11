import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateChatRoomDto {
  @IsNotEmpty()
  @IsEmail()
  teacher_id: string;
  @IsNotEmpty()
  @IsEmail()
  student_id: string;
 
}
