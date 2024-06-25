import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment';
import { Repository } from 'typeorm';
import { Slots } from 'src/slots/entities/slots';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { SlotStatus } from 'src/enum/slot-status.enum';
import { Student } from 'src/students/entities/student.entity';
import { AppointmentStatus } from 'src/enum/appointment-status.enum';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private AppointmentRepository: Repository<Appointment>,
    @InjectRepository(Slots) private SlotsRepository: Repository<Slots>,
    @InjectRepository(Teacher) private TeacherRepository: Repository<Teacher>,
    @InjectRepository(Student) private StudentRepository: Repository<Student>,
    private readonly mailService: MailService,
  ) {}
  async Create(createAppointmentDto: CreateAppointmentDto) {
    try {
      const teacher = await this.TeacherRepository.findOne({
        where: { email: createAppointmentDto.teacher_id },
      });
      const student = await this.StudentRepository.findOne({
        where: { email: createAppointmentDto.student_id },
      });
      if (!student) {
        throw new BadRequestException('Student doesnot exist');
      }
      if (!teacher) {
        throw new BadRequestException('Teacher doesnot exist');
      }

      const availableSlots = await this.SlotsRepository.find({
        where: { teacher_id: teacher, status: SlotStatus.available },
      });
      console.log('Available Slots', availableSlots);
      const selectedSlot = await this.SlotsRepository.findOne({
        where: { id: createAppointmentDto.slot_id },
      });
      if (!availableSlots) {
        throw new BadRequestException(
          'This teacher currently has no available slots',
        );
      }
      if (!selectedSlot) {
        throw new BadRequestException('This slot doesnot exist');
      }
      console.log('Available Status', availableSlots);

      const appointment = this.AppointmentRepository.create({
        ...createAppointmentDto,
        student_id: student,
        teacher_id: teacher,
        slot_id: selectedSlot,
        created_at: new Date(),
        status: AppointmentStatus.pending,
      });
      const details = {
        student_id: createAppointmentDto.student_id,
        slot_id: createAppointmentDto.slot_id,
      };
      this.mailService.sendAppointmentMail(
        createAppointmentDto.teacher_id,
        details,
      );
      await this.AppointmentRepository.save(appointment);
      return {
        message: 'Email sent to the teacher, wait for approval/rejection email',
        RequestedAppointment: appointment,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
