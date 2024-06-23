import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { PaginationSearchDto } from 'src/students/dto/pagination-seach.dto';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { CreateWhiteListDto } from 'src/whitelist/dto/create-whitelist.dto';
import { WhitelistService } from 'src/whitelist/whitelist.service';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('admin')
@Roles(Role.admin)
export class AdminController {
  constructor(
    private readonly whitelistService: WhitelistService,
    private readonly teacherService: TeachersService,
    private readonly studentService: StudentsService,
  ) {}

  @Post('/addDomain')
  Add(
    @Body(ValidationPipe)
    createWhiteListDto: CreateWhiteListDto,
  ) {
    return this.whitelistService.create(createWhiteListDto);
  }

  @Get('/allStudents')
  findAllStudents(@Query() paginationSearchDto: PaginationSearchDto) {
    return this.studentService.getAllStudents(paginationSearchDto);
  }
  @Get('/allTeachers')
  findAllTeachers(@Query() paginationSearchDto: PaginationSearchDto) {
    return this.teacherService.getAllTeachers(paginationSearchDto);
  }
}
