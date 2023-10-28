import { ICat } from '../interfaces/cat.interface';

export class CreateCatDto implements Omit<ICat, 'id'> {
  name: string;
  age: number;
  breed: string;
}
