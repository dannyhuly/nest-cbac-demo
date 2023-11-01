import { SetMetadata } from '@nestjs/common';
import { ClaimHandler as CustomClaimsHandler } from './claims.interface';

export const CUSTOM_CLAIMS_KEY = 'CUSTOM_CLAIMS_KEY';
export const CustomClaims = (...handlers: CustomClaimsHandler[]) =>
  SetMetadata(CUSTOM_CLAIMS_KEY, handlers);
