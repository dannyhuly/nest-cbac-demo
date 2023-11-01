import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppAbility } from '../casl/casl-ability.factory';
import { ClaimHandler } from './claims.interface';
import { CUSTOM_CLAIMS_KEY } from './claims.decorator';
import { AuthedRequest } from '../../auth/interfaces/auth-request.interface';

@Injectable()
export class ClaimsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<ClaimHandler[]>(
        CUSTOM_CLAIMS_KEY,
        context.getHandler(),
      ) || [];

    const req = context.switchToHttp().getRequest() as AuthedRequest;

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, req.ability),
    );
  }

  private execPolicyHandler(handler: ClaimHandler, ability: AppAbility) {
    if (Array.isArray(handler)) {
      return ability.can(handler[0], handler[1]);
    } else if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
