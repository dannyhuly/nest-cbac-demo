import { IUser } from '../../users/interfaces/user.interface';

export interface IAuthUser extends Omit<IUser, 'password'> {}
