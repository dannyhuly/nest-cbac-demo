// helper factory for creating

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { CbacService } from '../cbac.service';

interface GetClaimant<C> {
  (req: Request): Promise<C>;
}

export function createCbacMiddleware<C, S>(getClaimant: GetClaimant<C>) {
  @Injectable()
  class CbacMiddleware implements NestMiddleware {
    constructor(public cbacService: CbacService<C, S>) {}

    async use(req: Request, _res: Response, next: NextFunction) {
      const claimant = await getClaimant(req);
      this.cbacService.setClaimant(claimant, next);
    }
  }

  return CbacMiddleware;
}
