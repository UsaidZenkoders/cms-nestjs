import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CoursesService } from 'src/courses/courses.service';
import { CreateCourseDto } from 'src/courses/dto/create-course.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { CreateWhiteListDto } from 'src/whitelist/dto/create-whitelist.dto';
import { WhitelistService } from 'src/whitelist/whitelist.service';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly whitelistService: WhitelistService,
    private readonly courseService: CoursesService,
  ) {}
  @Roles(Role.admin)
  @Post('/addDomain')
  Add(
    @Body(ValidationPipe)
    createWhiteListDto: CreateWhiteListDto,
  ) {
    return this.whitelistService.create(createWhiteListDto);
  }
  @Post('/addCourse')
  Create(
    @Body(ValidationPipe)
    createCourseDto: CreateCourseDto,
  ) {
    return this.courseService.create(createCourseDto);
  }
}
