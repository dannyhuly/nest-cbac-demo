import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Claimant, Subjects } from './authz.utils';
import { CbacService } from '../modules/cbac/cbac.service';

@Injectable()
export class AuthzMiddleware implements NestMiddleware {
  constructor(private cbacService: CbacService<Claimant, Subjects>) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // bind CBAC to context (Uses AsyncLocalStorage)
    this.cbacService.setClaimant(req['user'], next);
  }
}
