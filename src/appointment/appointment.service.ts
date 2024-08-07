import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment';
import { Not, Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Student } from 'src/students/entities/student.entity';
import { AppointmentStatus } from 'src/enum/appointment-status.enum';
import { MailService } from 'src/mail/mail.service';
import { AppointmentStatusDto } from './dto/appointment-status.dto.';
import { ConfirmationMessage } from './constants';
import { getFormattedDate } from 'src/helpers/Date-formatter';
import { PaginationSearchDto } from 'src/students/dto/pagination-seach.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private AppointmentRepository: Repository<Appointment>,
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
      const studentalreadyRequested = await this.AppointmentRepository.findOne({
        where: {
          student_id: student,
          teacher_id: teacher,
          date: createAppointmentDto.date,
          start_time: createAppointmentDto.start_time,
          end_time: createAppointmentDto.end_time,
        },
      });
      if (studentalreadyRequested) {
        throw new BadRequestException(
          'Student has already requested for this slot',
        );
      }
      if (!student) {
        throw new BadRequestException('Student doesnot exist');
      }
      if (!teacher) {
        throw new BadRequestException('Teacher doesnot exist');
      }
      const { start_time, end_time, date } = createAppointmentDto;
      if (new Date(date) < new Date()) {
        throw new BadRequestException('Invalid Date ');
      }
      const formattedDate = getFormattedDate();

      const appointment = this.AppointmentRepository.create({
        ...createAppointmentDto,
        student_id: student,
        teacher_id: teacher,
        created_at: formattedDate,
        status: AppointmentStatus.pending,
      });
      const details = {
        student_id: createAppointmentDto.student_id,
        slot_detail: {
          date,
          start_time,
          end_time,
        },
      };
      this.mailService.sendAppointmentMail(
        createAppointmentDto.teacher_id,
        details,
      );
      await this.AppointmentRepository.save(appointment);
      const transormedAppointment = {
        AppointmentDetails: {
          id: appointment.id,
          date: appointment.date,
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          createdAt: appointment.created_at,
        },
        StudentDetails: {
          email: appointment.student_id.email,
          username: appointment.student_id.username,
        },
        TeacherDetails: {
          email: appointment.teacher_id.email,
          username: appointment.teacher_id.username,
        },
      };
      return {
        message: 'Email sent to the teacher, wait for approval/rejection email',
        RequestedAppointment: transormedAppointment,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  async ApproveRejectAppointment(
    appointmentStatusDto: AppointmentStatusDto,
    id: number,
  ) {
    const teacher = await this.TeacherRepository.findOne({
      where: { email: appointmentStatusDto.teacher_id },
    });
    const student = await this.StudentRepository.findOne({
      where: { email: appointmentStatusDto.student_id },
    });

    const appointment = await this.AppointmentRepository.findOne({
      where: {
        id: id,
      },
      relations: ['teacher_id', 'student_id'],
    });
    if (!teacher || !student || !appointment) {
      throw new BadRequestException('Appointment doesnot exist');
    }
    if (appointment.status === AppointmentStatus.approve) {
      throw new BadRequestException('Appointment is already approved');
    }
    if (appointment.status === AppointmentStatus.reject) {
      throw new BadRequestException('Appointment is already rejected');
    }

    if (appointmentStatusDto.status === AppointmentStatus.approve) {
      appointment.status = AppointmentStatus.approve;
      this.mailService.sendAppointmentStatusMail(
        appointmentStatusDto.student_id,
        ConfirmationMessage.approval,
      );
      await this.AppointmentRepository.save(appointment);

      try {
        const remainingAppointments = await this.AppointmentRepository.find({
          where: {
            teacher_id: teacher,
            start_time: appointmentStatusDto.start_time,
            end_time: appointmentStatusDto.end_time,
            status: AppointmentStatus.pending,
            id: Not(id),
          },
          relations: ['student_id'],
        });
        console.log('Remaining', remainingAppointments);

        await Promise.all(
          remainingAppointments.map(async (pendingAppointment) => {
            pendingAppointment.status = AppointmentStatus.reject;
            await this.AppointmentRepository.save(pendingAppointment);

            this.mailService.sendAppointmentStatusMail(
              pendingAppointment.student_id.email,
              ConfirmationMessage.reject,
            );
          }),
        );
      } catch (error) {
        console.log(error.message);
        throw new BadRequestException(error.message);
      }

      return {
        message: 'Appointment approved successfully',
      };
    } else if (appointmentStatusDto.status === AppointmentStatus.reject) {
      appointment.status = AppointmentStatus.reject;
      this.mailService.sendAppointmentStatusMail(
        appointmentStatusDto.student_id,
        ConfirmationMessage.reject,
      );

      await this.AppointmentRepository.save(appointment);
      return {
        message: 'Appointment rejected successfully',
      };
    }
  }
  async getAppointmentsbyTeacherId(email: string) {
    try {
      const teacher = await this.TeacherRepository.find({
        where: { email: email },
      });
      const teacherRecord = await this.AppointmentRepository.find({
        where: { teacher_id: teacher },
        relations: ['teacher_id'],
      });
      const transformedData = teacherRecord.map((record) => ({
        AppointmentDetails: {
          id: record.id,
          startingAt: record.start_time,
          endingAt: record.end_time,
          createdAt: record.created_at,
          scheduledfor: record.date,
        },
        TeacherDetails: {
          email: record.teacher_id.email,
          username: record.teacher_id.username,
        },
        StudentDetails: {
          email: record.teacher_id.email,
          username: record.teacher_id.username,
        },
      }));

      return {
        AppointmentSummary: transformedData,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getAppointmentsbyStudentId(email: string) {
    try {
      const student = await this.StudentRepository.find({
        where: { email: email },
      });
      const studentRecord = await this.AppointmentRepository.find({
        where: { student_id: student },
        relations: ['student_id'],
      });
      const transformedData = studentRecord.map((record) => ({
        AppointmentDetails: {
          id: record.id,
          startingAt: record.start_time,
          endingAt: record.end_time,
          createdAt: record.created_at,
          scheduledfor: record.date,
        },
        TeacherDetails: {
          email: record.teacher_id.email,
          username: record.teacher_id.username,
        },
        StudentDetails: {
          email: record.teacher_id.email,
          username: record.teacher_id.username,
        },
      }));

      return {
        AppointmentSummary: transformedData,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getAllAppointments(paginationSearchDto: PaginationSearchDto) {
    try {
      const { page, limit, search } = paginationSearchDto;
      const query =
        this.AppointmentRepository.createQueryBuilder('appointment');

      if (search) {
        query.where(
          'appointment.student_id LIKE :search OR appointment.teacher_id LIKE :search',
          {
            search: `%${search}%`,
          },
        );
      }

      const [result, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const previousPage = page > 1 ? page - 1 : null;

      return {
        data: result,
        count: total,
        totalPages,
        currentPage: page,
        nextPage,
        previousPage,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
