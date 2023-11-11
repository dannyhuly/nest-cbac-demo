import { Column, Table, Model, Unique, DataType } from 'sequelize-typescript';
import { IUser } from '../interfaces/user.interface';
import { Role } from '../role.enum';
import { SignInDto } from '../../auth';

@Table({
  tableName: 'users',
})
export class User extends Model<Omit<IUser, 'id'> & SignInDto> {
  @Unique
  @Column
  username: string;

  @Column
  password: string;

  @Column({
    defaultValue: Role.CREATOR,
    type: DataType.ENUM(...Object.values(Role)),
  })
  role: Role;
}
