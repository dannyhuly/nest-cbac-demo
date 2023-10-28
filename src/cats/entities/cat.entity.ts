import { Column, Table, Model } from 'sequelize-typescript';
import { ICat } from '../interfaces/cat.interface';

@Table({
  tableName: 'cats',
})
export class Cat extends Model implements ICat {
  @Column
  name: string;

  @Column
  age: number;

  @Column
  breed: string;
}
