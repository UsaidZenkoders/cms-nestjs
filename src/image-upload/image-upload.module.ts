import { Module } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';

@Module({
  providers: [ImageUploadService],
})
export class ImageUploadModule {}
