import { Role } from '../role.enum';
import { IUser } from '../interfaces/user.interface';

export class CreateUserDto implements Omit<IUser, 'id'> {
  username: string;
  password: string;
  role: Role;
}
