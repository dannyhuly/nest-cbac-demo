import { Column, Table, Model, Unique, DataType } from 'sequelize-typescript';
import { IUser } from '../interfaces/user.interface';

export enum Rules {
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
  VIEWER = 'VIEWER',
}

@Table({
  tableName: 'users',
})
export class User extends Model<IUser> {
  @Unique
  @Column
  username: string;

  @Column
  password: string;

  @Column({
    defaultValue: Rules.VIEWER,
    type: DataType.ENUM(...Object.values(Rules)),
  })
  rule: Rules;
}
