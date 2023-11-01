import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthedRequest } from '../../auth/interfaces/auth-request.interface';
import { CaslAbilityFactory } from './casl-ability.factory';

@Injectable()
export class SetCaslAbilitiesMiddleware implements NestMiddleware {
  constructor(private caslAbilityFactory: CaslAbilityFactory) {}

  async use(req: AuthedRequest, res: Response, next: NextFunction) {
    req.ability = await this.caslAbilityFactory.createForUser(req.user);
    next();
  }
}
