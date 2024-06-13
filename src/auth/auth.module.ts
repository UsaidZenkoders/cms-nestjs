import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
@Module({
  imports:[TypeOrmModule.forFeature([Student,Teacher])],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
