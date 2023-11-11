import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClaimHandler } from './interfaces/claims.interface';
import { CbacService } from './cbac.service';
import { CbacAppAbility } from './interfaces/cbac-abilities.interface';
import { CLAIM_QUALIFICATIONS_KEY } from './utils/create-claim-qualifications.decorator';

@Injectable()
export class CbacGuard<C, S> implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cbacService: CbacService<C, S>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<ClaimHandler<S>[]>(
        CLAIM_QUALIFICATIONS_KEY,
        context.getHandler(),
      ) || [];

    const ability = this.cbacService.getCbacAppAbility();

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(
    handler: ClaimHandler<S>,
    ability: CbacAppAbility<S>,
  ) {
    if (Array.isArray(handler)) {
      return ability.can(handler[0], handler[1]);
    } else if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
