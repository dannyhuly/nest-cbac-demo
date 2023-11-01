import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthedRequest } from './interfaces/auth-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as AuthedRequest;
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
