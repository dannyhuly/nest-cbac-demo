import { Abilities, AppAbility } from '../casl/casl-ability.factory';

// class based handle
interface IClaimHandler {
  handle(ability: AppAbility): boolean;
}

// function (factory) based handle
type ClaimsHandlerCallback = (ability: AppAbility) => boolean;

// value based
type Claim = Abilities;

export type ClaimHandler = Claim | IClaimHandler | ClaimsHandlerCallback;
