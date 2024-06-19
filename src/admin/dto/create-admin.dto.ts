import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsBoolean()
  is_verified: boolean = false;

  role: string = 'ADMIN';

  @IsOptional()
  @IsUrl({ allow_underscores: true })
  img: string;
}
