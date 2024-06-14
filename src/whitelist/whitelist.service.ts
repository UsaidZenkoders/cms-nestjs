import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { whitelist } from './entities/whitelist.entity';
import { Repository } from 'typeorm';
import { CreateWhiteListDto } from './dto/create-whitelist.dto';

@Injectable()
export class WhitelistService {
  constructor(
    @InjectRepository(whitelist)
    private whitelistRepository: Repository<whitelist>,
  ) {}
  async create(createWhiteListDto: CreateWhiteListDto) {
    try {
      const alreadyExist = await this.whitelistRepository.findOneBy({
        domain: createWhiteListDto.domain,
      });
      console.log(alreadyExist)
      if (alreadyExist) {
        return {
            message: 'domain already exist',
            status: HttpStatus.OK,
          };
       
      }
      const domain = this.whitelistRepository.create(createWhiteListDto);
      this.whitelistRepository.save(domain);
      return {
        message: 'domain added successfully',
        domain: domain,
        status: HttpStatus.OK,
      };
     
    } catch (error) {
      return {
        message: 'An error occured',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
