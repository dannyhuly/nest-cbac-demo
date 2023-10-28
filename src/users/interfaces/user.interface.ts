import { Rules } from '../entities/user.entity';

export interface IUser {
  username: string;
  password: string;
  rule: Rules;
}
