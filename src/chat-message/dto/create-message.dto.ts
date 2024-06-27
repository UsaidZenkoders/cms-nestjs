import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDateString()
  @IsNotEmpty()
  created_at: Date;

  @IsOptional()
  @IsString()
  senderStudentId?: string;

  @IsOptional()
  @IsString()
  recieverStudentId?: string;

  @IsOptional()
  @IsString()
  senderTeacherId?: string;

  @IsOptional()
  @IsString()
  recieverTeacherId?: string;
}
