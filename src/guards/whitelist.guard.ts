import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class whitelistGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Use multer middleware before accessing the request body
      await new Promise<void>((resolve, reject) => {
        multer().any()(
          context.switchToHttp().getRequest(),
          context.switchToHttp().getResponse(),
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          },
        );
      });

      const request = context.switchToHttp().getRequest();
      const { email } = request.body;

      if (!email) {
        throw new UnauthorizedException('Email does not exist');
      } else {
        const domain = email.split('@')[1];
        // Your domain validation logic here
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }

    return true;
  }
}
