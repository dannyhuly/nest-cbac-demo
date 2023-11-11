import { Request } from 'express';
import { IAuthedUser } from './auth-user.interface';

export interface AuthedRequest extends Request {
  user: IAuthedUser;
}
