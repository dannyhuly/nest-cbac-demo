import { Module } from '@nestjs/common';
import { CbacModule } from '../modules/cbac/cbac.module';
import { IUser, Role } from '../users';
import { Action } from '../modules/cbac/constants/cbac.actions';
import { CbacPoliciesOf } from '../modules/cbac/interfaces/cbac-abilities.interface';

@Module({
  imports: [
    CbacModule.forRootAsync({
      // inject: [dbEntities],
      // imports: [dbModule],
      useFactory: () => ({
        policyResolver: async (claimant: IUser) => {
          return getRules(claimant);
        },
      }),
    }),
  ],
  exports: [CbacModule],
})
export class AuthzModule {}

function getRules(user?: IUser): CbacPoliciesOf<'Cat' | 'User'> {
  // TODO: Get Rules from DB/JWT
  // See: https://casl.js.org/v6/en/cookbook/roles-with-persisted-permissions#the-solution

  if (user?.role == Role.ADMIN) {
    return [
      {
        action: Action.Manage,
        subject: 'all',
      },
    ];
  }

  // default rules
  let rules: CbacPoliciesOf<'Cat' | 'User'> = [
    {
      action: Action.Read,
      subject: 'Cat',
      conditions: { visible: true },
    },
  ];

  // GUEST
  if (!user) {
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
    return rules;
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
    return rules;
  }
}
