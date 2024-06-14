import { Body, Controller,Post, ValidationPipe } from '@nestjs/common';
import { WhitelistService } from './whitelist.service';
import { CreateWhiteListDto } from './dto/create-whitelist.dto';

@Controller('whitelist')
export class WhitelistController {
    constructor(private readonly whitelistService:WhitelistService){}
    
    @Post("/addwhitelist")
    Add(
        @Body(
            ValidationPipe)
            createWhiteListDto:CreateWhiteListDto
    ){
        return this.whitelistService.create(createWhiteListDto)
    }
    
}
