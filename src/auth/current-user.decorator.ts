import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthedRequest } from './interfaces/auth-request.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as AuthedRequest;
    return request.user;
  },
);
