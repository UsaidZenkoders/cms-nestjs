import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  roomId: string;
  @IsNotEmpty()
  @IsEmail()
  userId: string;
}
