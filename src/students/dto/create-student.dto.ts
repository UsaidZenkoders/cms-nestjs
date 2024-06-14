import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEmail,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsBoolean()
  is_suspended: boolean = false;

  @IsNotEmpty()
  @IsString()
  contact: string;

  @IsBoolean()
  is_verified: boolean = false;

  @IsNotEmpty()
  @IsInt()
  age: number;

  @IsOptional()
  @IsUrl({ allow_underscores: true })
  img: string;
}
