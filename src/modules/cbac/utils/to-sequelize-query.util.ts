import { ExtractSubjectType } from '@casl/ability';
import { Action } from '../constants/cbac.actions';
import { CbacAppAbility } from '../interfaces/cbac-abilities.interface';
import { rulesToQuery } from '@casl/ability/extra';
import { Op } from 'sequelize';

export function toSequelizeQuery<S>(
  ability: CbacAppAbility<S>,
  action: Action,
  subject: ExtractSubjectType<Parameters<CbacAppAbility<S>['rulesFor']>[1]>,
) {
  const query = rulesToQuery(ability, action, subject, ruleToSequelize);
  return query === null ? query : symbolize(query);
}

function ruleToSequelize(rule) {
  return rule.inverted ? { $not: rule.conditions } : rule.conditions;
}

/**
 * Tricky way to walk recursively over deeply nested object.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Parameters
 */
function symbolize(query) {
  return JSON.parse(JSON.stringify(query), function keyToSymbol(key, value) {
    if (key[0] === '$') {
      const symbol = Op[key.slice(1)];
      this[symbol] = value;
      return;
    }

    return value;
  });
}
