import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptService {
  async hash(password: string, saltRounds: number) {
    return await bcrypt.hash(password, saltRounds);
  }
  async compare(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
