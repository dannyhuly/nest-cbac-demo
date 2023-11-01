import { IUser } from '../../users/interfaces/user.interface';

export interface IAuthedUser extends Omit<IUser, 'password'> {}
