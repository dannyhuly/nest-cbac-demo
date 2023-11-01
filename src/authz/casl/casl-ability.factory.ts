import {
  createMongoAbility,
  MongoAbility,
  ForcedSubject,
  RawRuleOf,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './action.enum';
import { Role } from '../../users/role.enum';
import { IGuestUser, IUser } from '../../users/interfaces/user.interface';

export const Subjects = ['Cat', 'User', 'all'] as const;

export type Abilities = [
  Action,
  (
    | (typeof Subjects)[number]
    | ForcedSubject<Exclude<(typeof Subjects)[number], 'all'>>
  ),
];

export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class CaslAbilityFactory {
  async createForUser(user: IUser | IGuestUser) {
    const rules = await this.getRulesByUser(user);
    return createMongoAbility<AppAbility>(rules);
  }

  private async getRulesByUser(
    user: IUser | IGuestUser,
  ): Promise<RawRuleOf<AppAbility>[]> {
    // TODO: Get Rules from DB/JWT
    // See: https://casl.js.org/v6/en/cookbook/roles-with-persisted-permissions#the-solution
    if (user.role == Role.ADMIN) {
      return [
        {
          action: Action.Manage,
          subject: 'all',
        },
      ];
    }

    // default rules
    let rules: RawRuleOf<AppAbility>[] = [
      {
        action: Action.Read,
        subject: 'Cat',
        conditions: { visible: true },
      },
    ];

    if (user.role == Role.GUEST) {
      rules = rules.concat([
        {
          inverted: true,
          action: Action.Create,
          subject: 'Cat',
        },
        {
          inverted: true,
          action: Action.Update,
          subject: 'Cat',
        },
      ]);
    }

    if (user.role == Role.CREATOR) {
      rules = rules.concat([
        {
          action: Action.Read,
          subject: 'Cat',
          conditions: { userId: user.id, visible: false },
        },
        {
          action: Action.Create,
          subject: 'Cat',
        },
        {
          action: Action.Update,
          subject: 'Cat',
          conditions: { userId: user.id },
        },
        {
          action: Action.Delete,
          subject: 'Cat',
          conditions: { userId: user.id },
        },
      ]);
    }

    return rules;
  }
}
