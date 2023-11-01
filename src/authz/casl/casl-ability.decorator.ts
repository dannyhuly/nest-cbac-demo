import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthedRequest } from '../../auth/interfaces/auth-request.interface';

export const CaslAbility = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as AuthedRequest;
    return request.ability;
  },
);
