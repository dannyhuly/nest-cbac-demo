import { Request } from 'express';
import { IAuthUser } from './auth-user.interface';

export interface AuthRequest extends Request {
  user: IAuthUser;
}
