import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Admin } from 'src/admin/entities/admin.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher, Admin])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
