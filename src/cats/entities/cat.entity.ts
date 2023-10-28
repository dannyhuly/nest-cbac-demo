import {
  Column,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { ICat } from '../interfaces/cat.interface';
import { User } from '../../users/entities/user.entity';

@Table({
  tableName: 'cats',
})
export class Cat extends Model<ICat> {
  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  age: number;

  @AllowNull(false)
  @Column
  breed: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({ field: 'userId' })
  userId: number; // user ID stored in my Database

  @BelongsTo(() => User)
  user: User;
}
