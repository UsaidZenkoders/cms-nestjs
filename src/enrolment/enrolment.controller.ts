import { Controller, UseGuards } from '@nestjs/common';
import { EnrolmentService } from './enrolment.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('enrolment')
export class EnrolmentController {
  constructor(private enrolmentService: EnrolmentService) {}
}
