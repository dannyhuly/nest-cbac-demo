import { ForcedSubject, MongoAbility, RawRuleOf } from '@casl/ability';
import { Action } from '../constants/cbac.actions';

export type CbacAbilities<S = ReadonlyArray<string>> = [
  Action,
  S | 'all' | ForcedSubject<Exclude<S, 'all'>>,
];

export type CbacAppAbility<S> = MongoAbility<CbacAbilities<S>>;

export type CbacPoliciesOf<S> = RawRuleOf<CbacAppAbility<S>>[];
