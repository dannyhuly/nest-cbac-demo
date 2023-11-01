import { Test } from '@nestjs/testing';
import { CaslAbilityFactory } from './casl-ability.factory';
import { Cat } from '../../cats/entities/cat.entity';
import { Role } from '../../users/role.enum';
import { IUser } from '../../users/interfaces/user.interface';
import { faker } from '@faker-js/faker';
import { Action } from './action.enum';
import { subject } from '@casl/ability';

describe('CaslAbilityFactory', () => {
  let caslAbilityFactory: CaslAbilityFactory;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CaslAbilityFactory],
    }).compile();

    caslAbilityFactory = moduleRef.get<CaslAbilityFactory>(CaslAbilityFactory);
  });

  it('should be defined', async () => {
    expect(caslAbilityFactory).toBeDefined();
  });

  it('should apply GUEST rules', async () => {
    const caslAbility = await caslAbilityFactory.createForUser({
      role: Role.GUEST,
    });

    const hiddenCat: Partial<Cat> = { visible: false };

    expect(caslAbility.can(Action.Create, 'Cat')).toBeFalsy();
    expect(caslAbility.can(Action.Read, 'Cat')).toBeTruthy();
    expect(caslAbility.can(Action.Update, 'Cat')).toBeFalsy();
    expect(caslAbility.can(Action.Delete, 'Cat')).toBeFalsy();
    expect(caslAbility.can(Action.Read, subject('Cat', hiddenCat))).toBeFalsy();
  });

  it('should apply CREATOR rules', async () => {
    const user: IUser = {
      id: 1,
      role: Role.CREATOR,
      username: faker.internet.userName(),
    };

    const caslAbility = await caslAbilityFactory.createForUser(user);

    const ownedCat: Partial<Cat> = { userId: user.id, visible: false };
    const otherHiddenCat: Partial<Cat> = {
      userId: user.id + 1,
      visible: false,
    };
    const otherVisibleCat: Partial<Cat> = {
      userId: user.id + 2,
      visible: true,
    };

    expect(caslAbility.can(Action.Create, 'Cat')).toBeTruthy();
    expect(caslAbility.can(Action.Read, 'Cat')).toBeTruthy();
    expect(caslAbility.can(Action.Update, 'Cat')).toBeTruthy();
    expect(caslAbility.can(Action.Delete, 'Cat')).toBeTruthy();
    expect(caslAbility.can(Action.Read, subject('Cat', ownedCat))).toBeTruthy();
    expect(
      caslAbility.can(Action.Read, subject('Cat', otherHiddenCat)),
    ).toBeFalsy();
    expect(
      caslAbility.can(Action.Read, subject('Cat', otherVisibleCat)),
    ).toBeTruthy();
    expect(
      caslAbility.can(Action.Update, subject('Cat', ownedCat)),
    ).toBeTruthy();
    expect(
      caslAbility.can(Action.Update, subject('Cat', otherHiddenCat)),
    ).toBeFalsy();
  });

  it('should apply ADMIN rules', async () => {
    const user: IUser = {
      id: 1,
      role: Role.ADMIN,
      username: faker.internet.userName(),
    };

    const caslAbility = await caslAbilityFactory.createForUser(user);

    const ownedCat: Partial<Cat> = { userId: user.id };
    const otherCat: Partial<Cat> = { userId: user.id + 1 };

    // cat
    expect(caslAbility.can(Action.Manage, 'Cat')).toBeTruthy();
    expect(
      caslAbility.can(Action.Manage, subject('Cat', ownedCat)),
    ).toBeTruthy();
    expect(
      caslAbility.can(Action.Manage, subject('Cat', otherCat)),
    ).toBeTruthy();

    // user
    expect(caslAbility.can(Action.Manage, 'User')).toBeTruthy();
  });
});
