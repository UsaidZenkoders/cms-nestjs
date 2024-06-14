import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { whitelist } from 'src/whitelist/entities/whitelist.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher, Admin,whitelist]),
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '600s' },
  }),],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
