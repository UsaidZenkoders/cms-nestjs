import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  @IsString()
  roomId: string;
  @IsNotEmpty()
  @IsEmail()
  senderId: string;
  @IsNotEmpty()
  @IsEmail()
  receiverId: string;
}
