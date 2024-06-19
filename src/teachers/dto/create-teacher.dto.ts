import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateTeacherDto {
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

  role: string = 'TEACHER';

  @IsBoolean()
  is_verified: boolean = false;

  @IsNotEmpty()
  age: string;

  @IsOptional()
  @IsUrl({ allow_underscores: true })
  img: string;
}
