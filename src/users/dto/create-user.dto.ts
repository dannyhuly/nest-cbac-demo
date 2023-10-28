import { Rules } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';

export class CreateUserDto implements IUser {
  username: string;
  password: string;
  rule: Rules;
}
