import { ICat } from '../interfaces/cat.interface';

export class UpdateCatDto implements Partial<ICat> {
  name?: string;
  age?: number;
  breed?: string;
}
