import { Body, Controller,Post } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';

@Controller('enrolment')
export class EnrolmentController {
    constructor(private EnrolmentService:EnrolmentService){}
    @Post("")
    Get(@Body() email:string){
return this.EnrolmentService.GetAllEnrolmentsWithTeacher(email)
    }
}
