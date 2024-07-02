import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
    @InjectRepository(Admin) private AdminRepository: Repository<Admin>,
    @InjectRepository(Teacher) private TeacherRepository: Repository<Teacher>,
    private readonly imageUploadService: ImageUploadService,
  ) {}
  async SuspendStudent(email: string) {
    try {
      const studenttobeSuspended = await this.StudentRepository.findOneBy({
        email,
      });
      if (!studenttobeSuspended) {
        return new BadRequestException('Student doesnot exist');
      }
      await this.StudentRepository.update(
        { email: email },
        { is_suspended: true },
      );
      return {
        message: 'Student suspended successfully',
        SuspendedStudent: studenttobeSuspended,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async SuspendTeacher(email: string) {
    try {
      const teachertobeSuspended = await this.TeacherRepository.findOne({
        where: { email },
      });
      if (!teachertobeSuspended) {
        return new BadRequestException('Teacher doesnot exist');
      }
      await this.TeacherRepository.update(
        { email: email },
        { is_suspended: true },
      );
      return {
        message: 'Teacher suspended successfully',
        SuspendedTeacher: teachertobeSuspended,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async UpdateImage(email: string, image: Express.Multer.File) {
    const admin = await this.AdminRepository.findOneBy({
      email: email,
    });
    if (!admin) {
      throw new BadRequestException('admin doesnot exist');
    }
    const imageUrl = await this.imageUploadService.uploadImage(image);
    await this.AdminRepository.save({ ...admin, img: imageUrl });
  }
  async ViewProfileDetails(email: string) {
    const adminProfile = await this.AdminRepository.findOneBy({
      email: email,
    });

    return { admin: adminProfile };
  }
  async updateAdminProfile(email: string, updateAdminDto: UpdateAdminDto) {
    try {
      const admin = await this.AdminRepository.findOneBy({ email: email });
      console.log(admin);
      const updateAdmin = await this.AdminRepository.save({
        ...admin,
        ...updateAdminDto,
      });

      return {
        message: 'Admin Updated Successfully',
        admin: updateAdmin,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
