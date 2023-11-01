import { Request } from 'express';
import { IAuthedUser } from './auth-user.interface';
import { AppAbility } from '../../authz';

export interface AuthedRequest extends Request {
  user: IAuthedUser;
  ability: AppAbility;
}
