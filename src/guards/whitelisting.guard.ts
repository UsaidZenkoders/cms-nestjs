import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { WhitelistService } from 'src/whitelist/whitelist.service'; // Adjust the import according to your service location

@Injectable()
export class whitelistingGuard implements CanActivate {
  constructor(private readonly whitelistService: WhitelistService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const email = request.body.email;
    console.log('Email:', email);
    if (!email) {
      throw new UnauthorizedException('Email is required');
    }

    const isWhitelisted = await this.whitelistService.validateDomain(email);

    if (!isWhitelisted) {
      throw new UnauthorizedException('Domain not allowed');
    }

    return true;
  }
}
