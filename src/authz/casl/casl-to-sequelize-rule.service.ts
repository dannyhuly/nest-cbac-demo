import { ExtractSubjectType } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './action.enum';
import { rulesToQuery } from '@casl/ability/extra';
import { Op } from 'sequelize';
import { AppAbility } from './casl-ability.factory';

@Injectable()
export class CaslToSequelizeRuleService {
  // https://casl.js.org/v4/en/advanced/ability-to-database-query
  toSequelizeQuery(
    ability: AppAbility,
    action: Action,
    subject: ExtractSubjectType<Parameters<AppAbility['rulesFor']>[1]>,
  ) {
    const query = rulesToQuery(ability, action, subject, this.ruleToSequelize);
    return query === null ? query : this.symbolize(query);
  }

  private ruleToSequelize(rule) {
    return rule.inverted ? { $not: rule.conditions } : rule.conditions;
  }

  /**
   * Tricky way to walk recursively over deeply nested object.
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Parameters
   */
  private symbolize(query) {
    return JSON.parse(JSON.stringify(query), function keyToSymbol(key, value) {
      if (key[0] === '$') {
        const symbol = Op[key.slice(1)];
        this[symbol] = value;
        return;
      }

      return value;
    });
  }
}
