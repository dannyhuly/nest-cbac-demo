## Description

A **DEMO** [Nest][Nest] API server with **C**laim **B**ased **A**ccess **C**ontrol (CBAC) support using [CASL][CASL].

To implement the CBAC the following specification were implemented

- Each _User_ is assigned a _Role_.
- Each _Role_ is a collection of _Policy_.
- Each _API_ is assigned a _Clam_

When a _User_ sends an API request his assigned _Role_ will be challenged by the API _Clam_.

> Any section of the Code can be assigned a Clam (Not only APIs) if outer interfaces need to be supported.

[![](https://mermaid.ink/img/pako:eNptUU1rwzAM_SvCpw2a_gDDTlsPhY6Olh02fKhqq4nbRC62M1aS_PfZSQqDTRd9PT3ZT53QzpCQoigKxdHGmiRsvSEP9I3NtSbFY4v8i8XSY6MYkr3vVzvo-6Loe9htNysJGIItmQxMgFyEIQFcB2_bzfr5AyRUGBRP_bnWTVm2EL3lElBH6xiUaJCxJOhBe8KYg-RNcu3VTLmhmiIp8YcjtMcz6ZhIVvlPN2Bs_sNpx8bmdSFBzyGtnRuGTpZHREX6Ag-zFhIOHbSB_NrI0S-tgeHw-Jv66FxNyGD5i3zMeoj1PRzZlhBbT_AEGpldvM8OisVCNOQbtCYdZFRGiVhRfrpMoUF_yegh4bCNbn9jLWT0LS3EpMl8IiFPWIdUpfQ751-nC4-HXogr8qdzzTQ4_ABBdqeQ?type=png)](https://mermaid.live/edit#pako:eNptUU1rwzAM_SvCpw2a_gDDTlsPhY6Olh02fKhqq4nbRC62M1aS_PfZSQqDTRd9PT3ZT53QzpCQoigKxdHGmiRsvSEP9I3NtSbFY4v8i8XSY6MYkr3vVzvo-6Loe9htNysJGIItmQxMgFyEIQFcB2_bzfr5AyRUGBRP_bnWTVm2EL3lElBH6xiUaJCxJOhBe8KYg-RNcu3VTLmhmiIp8YcjtMcz6ZhIVvlPN2Bs_sNpx8bmdSFBzyGtnRuGTpZHREX6Ag-zFhIOHbSB_NrI0S-tgeHw-Jv66FxNyGD5i3zMeoj1PRzZlhBbT_AEGpldvM8OisVCNOQbtCYdZFRGiVhRfrpMoUF_yegh4bCNbn9jLWT0LS3EpMl8IiFPWIdUpfQ751-nC4-HXogr8qdzzTQ4_ABBdqeQ)

> Note: DB integration not yet implemented

### Policy Based Queries

For some actions (like: read and update) is not enough to only protect the endpoint.
Some actions will need to Query a 3rd party service (db, HTTP API, etc.) with the correct filters to prevent pulling or updating records.

This DEMO support a **sequelize** solution (can be modify for other DBs) for creating a **WHERE** statement from _Polices_. (see: `cats.controller.ts`)

### Integrate In Nest Application

1. Create `./authz.utils.ts` file and introduce the following to the app
  - **Claimant** - The user type which all clams will be checked agents 
  - **Subjects** - A list of clams types. Each clam type will support 5 actions (manage, create, read, update, delete). Usably the list will corelate with the project controllers but not exclusively.
  - **ClaimQualifications** - A decorator for declaring a clam for the claimant to pass
  - **CbacMiddleware** - A middleware with a Claimant resolver callback which will bind the Claimant to the app context (currently works only with Express)

```ts
// ./authz.utils.ts
import { IUser } from '../users';
import {
  createCbacMiddleware,
  createClaimQualificationsDecorator,
} from '../modules/cbac';

export type Claimant = IUser;
export type Subjects = 'Cat' | 'User';

export const ClaimQualifications = createClaimQualificationsDecorator<Subjects>();
export const CbacMiddleware = createCbacMiddleware<Claimant, Subjects>((req) => req['user']);
```

2. Add `CbacMiddleware` to all routes

```ts
@Module({
    imports: [
      AuthModule,
      AuthzModule,
    ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, CbacMiddleware)
      .forRoutes('*');
  }
}
```

#### Adding Claim Qualifications

There are couple of ways to run a check:

##### Using Decorators

```ts
  // 1. using CbacGuard + ClaimQualifications (raw value)
  @UseGuards(CbacGuard)
  @ClaimQualifications([Action.Read, 'Cat'])
  @Get()
  async findAll() {
    ...
  }
```

```ts
  // 2. using CbacGuard + ClaimQualifications (arrow function)
  @UseGuards(ClaimsGuard)
  @ClaimQualifications((ability: AppAbility) => ability.can(Action.Read, 'Cat'))
  @Get()
  async findAll() {
    ...
  }
```

##### Using Manually  
```ts
  // 3. manual check (using CbacService)
  export class CatsController {
  constructor(
    private cbacService: CbacService<Claimant, Subjects>,
  ) {}

  @Get()
  async findAll() {
    if(this.cbacService.getCbacAppAbility.can(Action.Read, 'Cat')) {
      ...
    }
  }
```

### Using with DB

Some times we like to restrict the dataset not the whole flow. We can achieve this by creating a BD query filter from the user policy.

Example: if the policy dictates that following 
- A user can see all visible Cats 
- A user can see his hidden Cats

The the following query is generated:
```sql
SELECT * FROM `Cats` WHERE ((`Cats`.`userId` = :USER_ID AND `Cats`.`visible` = 0) OR `Cats`.`visible` = 1);
``` 

The CBAC can generate a WHERE statement to restrict data set (for update and delete as well) by using the following methods.


##### MongoDB
```ts
  @ClaimQualifications([Action.Read, 'Cat'])
  @Get()
  async findAll() {
    const queryWhere = this.cbacService.toMongoQuery(Action.Read, 'Cat');
    // queryWhere: { '$or': [ { userId: 2, visible: false }, { visible: true } ] }

    return this.catsService.findAll(queryWhere);
  }
```

##### Sequelize
https://casl.js.org/v6/en/advanced/ability-to-database-query
```ts
  @ClaimQualifications([Action.Read, 'Cat'])
  @Get()
  async findAll() {
    const queryWhere = this.cbacService.toSequelizeQuery(Action.Read, 'Cat');
    // queryWhere: { [Symbol(or)]: [ { userId: 2, visible: false }, { visible: true } ] }

    return this.catsService.findAll(queryWhere);
  }
```

##### TypeORM
TBD
##### Prisma
TBD

### Predefine Demo Dataset

The DEMO uses [SQLite](https://www.sqlite.org/index.html) and sequelize to support data persistency.

##### Users:

| username | password | role    |
| -------- | -------- | ------- |
| admin    | admin    | ADMIN   |
| creator  | creator  | CREATOR |

> use `POST /auth/login` to generate a JWT token 

##### Polices:

- **ADMIN** can manage all resources (manage = create+read+update+delete)
- **CREATOR** and **GUEST** can read _visible_ _Cats_
- **CREATOR** can create _Cats_
- **CREATOR** can read owned _hidden_ _Cats_
- **CREATOR** can update owned _Cats_
- **CREATOR** can delete owned _Cats_

> Note: When a **CREATOR** reads cats it will get all _visible_ and owned _hidden_

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

> OpenAPI (Swagger) client at http://localhost:3000/api

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## TODO:

 - [ ] Load policies CASL from DB
 - [ ] Support DB migrations files (add demo-init seed file)
 - [ ] Encapsulate casl + authz to NestJS Module 
 - [ ] Pagination for `GET /cats` api



  [CASL]: https://casl.js.org/v6/en
  [Nest]: https://github.com/nestjs/nest
