import { CbacAbilities, CbacAppAbility } from './cbac-abilities.interface';

// class based handle
interface IClaimHandler<S> {
  handle(ability: CbacAppAbility<S>): boolean;
}

// function (factory) based handle
type ClaimsHandlerCallback<S> = (ability: CbacAppAbility<S>) => boolean;

// value based
type Claim<S> = CbacAbilities<S>;

export type ClaimHandler<S> =
  | Claim<S>
  | IClaimHandler<S>
  | ClaimsHandlerCallback<S>;
