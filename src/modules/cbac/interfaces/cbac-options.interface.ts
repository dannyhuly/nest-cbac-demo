import { ModuleMetadata, Type } from '@nestjs/common';
import { CbacPoliciesOf } from './cbac-abilities.interface';

export interface CbacModuleOptions<C, S> {
  policyResolver: { (claimant: C): Promise<CbacPoliciesOf<S>> };
}

export interface CbacModuleFactory<C, S> {
  createCbacProvider: () =>
    | Promise<CbacModuleOptions<C, S>>
    | CbacModuleOptions<C, S>;
}

export interface CbacModuleAsyncOptions<C, S>
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<CbacModuleFactory<C, S>>;
  useExisting?: Type<CbacModuleFactory<C, S>>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CbacModuleOptions<C, S>> | CbacModuleOptions<C, S>;
}
