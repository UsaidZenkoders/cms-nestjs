import { Module } from '@nestjs/common';
import { WhitelistController } from './whitelist.controller';
import { WhitelistService } from './whitelist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { whitelist } from './entities/whitelist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([whitelist])],

  controllers: [WhitelistController],
  providers: [WhitelistService],
})
export class WhitelistModule {}
