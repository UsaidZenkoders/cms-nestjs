import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherDto } from 'src/teachers/dto/create-teacher.dto';

export class LoginAdminDto extends PartialType(CreateTeacherDto) {}
