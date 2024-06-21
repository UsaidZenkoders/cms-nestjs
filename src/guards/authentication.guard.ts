import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      console.log('Inside the AuthenticationGuard');
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      console.log('Token:', token);

      if (!token) {
        throw new UnauthorizedException('Token does not exist');
      }

      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      console.log('Decoded JWT:', decoded);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        "You are not authenticated, login please"
      );
    }
  }
}
