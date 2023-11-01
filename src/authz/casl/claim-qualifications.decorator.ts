import { SetMetadata } from '@nestjs/common';
import { ClaimHandler } from '../cbac/claims.interface';

export const CLAIM_QUALIFICATIONS_KEY = 'CLAIM_QUALIFICATIONS_KEY';
export const ClaimQualifications = (...handlers: ClaimHandler[]) =>
  SetMetadata(CLAIM_QUALIFICATIONS_KEY, handlers);
