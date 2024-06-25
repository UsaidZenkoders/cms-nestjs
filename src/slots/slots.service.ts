import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slots } from './entities/slots';
import { Repository } from 'typeorm';
import { CreateSlotDto } from './dto/create-slot.dto';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { SlotStatus } from 'src/enum/slot-status.enum';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slots) private SlotsRepository: Repository<Slots>,
    @InjectRepository(Teacher) private TeacherRepoistory: Repository<Teacher>,
  ) {}

  async Create(createSlotDto: CreateSlotDto) {
    try {
      const teacher = await this.TeacherRepoistory.findOneBy({
        email: createSlotDto.teacher_id,
      });
      if (!teacher) {
        throw new BadRequestException('Teacher doesnot exist');
      }
      const slotExist = await this.SlotsRepository.findOneBy({
        date: createSlotDto.date,
        start_time: createSlotDto.start_time.toString(),
        teacher_id: teacher,
      });
      console.log(slotExist);
      if (slotExist) {
        throw new BadRequestException(
          'Slot of this teacher at this time already exist',
        );
      }
      const createdSlot = this.SlotsRepository.create({
        ...createSlotDto,
        teacher_id: teacher,
        status: SlotStatus.available,
        created_at: new Date(),
        updated_at: new Date(),
      });
      console.log('Created Slot', createdSlot);
      const { email, contact, is_verified, is_suspended, username } =
        createdSlot.teacher_id;
      await this.SlotsRepository.save(createdSlot);
      return {
        message: 'Slot created successfully',
        createdSlot: {
          SlotDetails: {
            id: createdSlot.id,
            startTime: createdSlot.start_time,
            duration: createdSlot.duration,
            date: createdSlot.date,
            status: createdSlot.status,
          },
          TeacherDetails: {
            username,
            email,
            contact,
            is_verified,
            is_suspended,
          },
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getAllSlots() {
    const slots = await this.SlotsRepository.find({
      relations: { teacher_id: true },
    });
    if (!slots) {
      return {
        message: 'No slots to show',
      };
    }
    const transformedSlots = slots.map((slot) => ({
      slotInfo: {
        id: slot.id,
        startTime: slot.start_time,
        duration: slot.duration,
        date: slot.date,
        status: slot.status,
        created_at: slot.created_at.toISOString().split('T')[0],
      },

      teacherInfo: {
        email: slot.teacher_id.email,
        username: slot.teacher_id.username,
      },
    }));
    return {
      Slots: transformedSlots,
    };
  }
  async getSlotbyId(id: number) {
    const slots = await this.SlotsRepository.find({
      where: { id: id },
      relations: { teacher_id: true },
    });
    if (!slots || slots.length === 0) {
      return {
        message: 'No slot to show',
      };
    }
    const transformedSlots = slots.map((slot) => ({
      slotInfo: {
        id: slot.id,
        startTime: slot.start_time,
        duration: slot.duration,
        date: slot.date,
        status: slot.status,
        created_at: slot.created_at.toISOString().split('T')[0],
      },

      teacherInfo: {
        email: slot.teacher_id.email,
        username: slot.teacher_id.username,
      },
    }));
    return {
      Slot: transformedSlots,
    };
  }
  async updateSlot(id: number, updateSlotDto: UpdateSlotDto) {
    try {
      let teacherId;
      if (updateSlotDto.teacher_id) {
        teacherId = await this.TeacherRepoistory.findOne({
          where: { email: updateSlotDto.teacher_id },
          relations: { appointments: false },
        });
      }
      if (!teacherId) {
        throw new Error('Teacher doesnot exist');
      }
      const slot = await this.SlotsRepository.findOne({
        where: {
          id: id,
          teacher_id: teacherId,
        },
        relations: { teacher_id: true },
      });
      if (slot) {
        const updated = await this.SlotsRepository.update(
          { id: id },
          { ...updateSlotDto, teacher_id: teacherId },
        );
        if (updated.affected >= 1) {
          return {
            message: 'Slot updated successfully',
            UpdatedSlot: slot,
          };
        }
      }
      throw new NotFoundException('Slot doesnot exist');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteSlotbyId(id: number, email: string) {
    try {
      const teacherId = await this.TeacherRepoistory.findOne({
        where: { email: email },
      });
      if (!teacherId) {
        throw new BadRequestException('Teacher doesnot exist');
      }
      const slotExist = await this.SlotsRepository.findOne({
        where: { id: id, teacher_id: teacherId },
      });
      if (slotExist && slotExist.status == SlotStatus.available) {
        const removedSlot = await this.SlotsRepository.delete(slotExist.id);
        if (removedSlot.affected >= 1) {
          return {
            message: 'Slot deleted successfully ',
            DeletedSlot: slotExist,
          };
        }
        throw new BadRequestException(
          'Either slot doesnot exist or slot is reserved',
        );
      }

      throw new BadRequestException('Slot doesnot exist');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
