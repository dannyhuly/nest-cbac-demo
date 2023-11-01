import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtToken } from './interfaces/jwt-token.type';
import { AuthService } from './auth.service';
import { Role } from '../users/role.enum';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req) as JwtToken;
    if (token) {
      try {
        const payload = await this.authService.verifyToken(token);
        req['user'] = payload;
      } catch {
        throw new BadRequestException('Invalid JWT token');
      }
    } else {
      req['user'] = { role: Role.GUEST };
    }
    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
