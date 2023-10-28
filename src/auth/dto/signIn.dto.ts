import { IUser } from '../../users/interfaces/user.interface';

export class SignInDto implements Pick<IUser, 'username' | 'password'> {
  username: string;
  password: string;
}
