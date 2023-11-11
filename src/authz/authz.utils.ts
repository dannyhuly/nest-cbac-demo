import { IUser } from '../users';
import {
  createCbacMiddleware,
  createClaimQualificationsDecorator,
} from '../modules/cbac';

export type Claimant = IUser;
export type Subjects = 'Cat' | 'User';

export const ClaimQualifications =
  createClaimQualificationsDecorator<Subjects>();
export const CbacMiddleware = createCbacMiddleware<Claimant, Subjects>(
  (req) => req['user'],
);
