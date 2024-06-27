import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Emails } from './entity/emails.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Emails) private EmailsRepository: Repository<Emails>,
  ) {}
  async createEmail(email: string, role: string) {
    const addedEmail = this.EmailsRepository.create({
      email: email,
      role: role,
    });
    await this.EmailsRepository.save(addedEmail);
  }
  async getEmails(email: string): Promise<boolean> {
    const registeredEmail = await this.EmailsRepository.findOneBy({
      email: email,
    });
    if (registeredEmail) {
      return true;
    }
    return false;
  }
}
