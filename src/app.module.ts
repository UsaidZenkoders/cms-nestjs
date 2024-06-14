import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { AdminModule } from './admin/admin.module';
import { TeachersModule } from './teachers/teachers.module';
import { AuthModule } from './auth/auth.module';
import { Student } from './students/entities/student.entity';
import { Teacher } from './teachers/entities/teacher.entity';
import { Admin } from './admin/entities/admin.entity';
import { WhitelistModule } from './whitelist/whitelist.module';
import { whitelist } from './whitelist/entities/whitelist.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'usaid12.zenkoders',
      database: 'cms',
      entities: [Student, Teacher, Admin,whitelist],
      synchronize: true,
    }),
    StudentsModule,
    AdminModule,
    TeachersModule,
    AuthModule,
    WhitelistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
