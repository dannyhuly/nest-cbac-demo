import { Role } from '../role.enum';

export interface IUser {
  id: number;
  username: string;
  role: Role;
}

export interface IGuestUser {
  role: Role.GUEST;
}
