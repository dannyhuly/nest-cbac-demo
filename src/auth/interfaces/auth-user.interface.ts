import { IUser } from '../../users';

export interface IAuthedUser extends Omit<IUser, 'password'> {}
