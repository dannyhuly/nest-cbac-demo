import { SetMetadata } from '@nestjs/common';
import { ClaimHandler } from '../interfaces/claims.interface';

export const CLAIM_QUALIFICATIONS_KEY = 'CLAIM_QUALIFICATIONS_KEY';

export function createClaimQualificationsDecorator<S>() {
  const ClaimQualifications = (...handlers: ClaimHandler<S>[]) =>
    SetMetadata(CLAIM_QUALIFICATIONS_KEY, handlers);
  return ClaimQualifications;
}
