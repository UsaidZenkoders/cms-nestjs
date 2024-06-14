import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWhiteListDto {
  @IsNotEmpty()
  @IsString()
  domain: string;
}
