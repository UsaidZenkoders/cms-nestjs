import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { whitelist } from 'src/whitelist/entities/whitelist.entity';
import { WhitelistService } from 'src/whitelist/whitelist.service';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesService } from 'src/courses/courses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Course, whitelist])],
  controllers: [AdminController],
  providers: [AdminService, WhitelistService, CoursesService],
})
export class AdminModule {}
