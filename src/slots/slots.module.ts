import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slots } from './entities/slots';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slots, Teacher])],
  controllers: [SlotsController],
  providers: [SlotsService, ImageUploadService],
})
export class SlotsModule {}
