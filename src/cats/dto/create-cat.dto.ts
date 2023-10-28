import { ICat } from '../interfaces/cat.interface';

export class CreateCatDto implements ICat {
  name: string;
  age: number;
  breed: string;
}
