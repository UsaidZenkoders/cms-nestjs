import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from './create-teacher.dto';

export class LoginTeacherDto extends PartialType(CreateTeacherDto) {}
