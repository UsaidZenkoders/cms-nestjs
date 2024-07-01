import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;
  @IsNotEmpty()
  @IsEmail()
  userId: string;
}
