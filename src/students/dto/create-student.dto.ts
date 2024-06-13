import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsEmail,
  IsStrongPassword,
  IsUrl,
  IsBoolean,
  IsPhoneNumber,
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

  @IsNotEmpty()
  @IsUrl({ allow_underscores: true })
  img: string;
}
