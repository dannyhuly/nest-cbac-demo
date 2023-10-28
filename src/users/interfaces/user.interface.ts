import { Rules } from '../entities/user.entity';

export interface IUser {
  id: number;
  username: string;
  password: string;
  rule: Rules;
}
