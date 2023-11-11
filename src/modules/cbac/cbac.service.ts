import { Inject, Injectable } from '@nestjs/common';
import { Action } from './constants/cbac.actions';
import { CbacModuleOptions } from './interfaces/cbac-options.interface';
import {
  ExtractSubjectType,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { CbacAppAbility } from './interfaces/cbac-abilities.interface';
import { CbacAsyncLocalStorageToken } from './cbac-async-local-storage.provider';
import { AsyncLocalStorage } from 'async_hooks';
import { CBAC_MODULE_OPTIONS } from './constants/cbac-module.constants';
import { toSequelizeQuery } from './utils/to-sequelize-query.util';
import { rulesToQuery } from '@casl/ability/extra';

@Injectable()
export class CbacService<C, S> {
  constructor(
    @Inject(CBAC_MODULE_OPTIONS) private options: CbacModuleOptions<C, S>,
    @Inject(CbacAsyncLocalStorageToken)
    private cbaAsyncLocalStorage: AsyncLocalStorage<MongoAbility>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  async setClaimant(claimant: C, runContext: Function) {
    const policies = await this.options.policyResolver(claimant);
    const ability = createMongoAbility(policies);

    this.cbaAsyncLocalStorage.run(ability, () => runContext());
  }

  getCbacAppAbility() {
    return this.cbaAsyncLocalStorage.getStore() as CbacAppAbility<S>;
  }

  toSequelizeQuery(
    action: Action,
    subject: ExtractSubjectType<Parameters<CbacAppAbility<S>['rulesFor']>[1]>,
  ) {
    return toSequelizeQuery(this.getCbacAppAbility(), action, subject);
  }

  toMongoQuery(
    action: Action,
    subject: ExtractSubjectType<Parameters<CbacAppAbility<S>['rulesFor']>[1]>,
  ) {
    return rulesToQuery(this.getCbacAppAbility(), action, subject, (rule) => {
      return rule.inverted ? { $not: rule.conditions } : rule.conditions;
    });
  }
}
