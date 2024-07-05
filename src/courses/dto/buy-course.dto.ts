import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class BuyCourseDetailsDto {
  @IsString()
  @IsNotEmpty()
  code: string;
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  price: number;


}
