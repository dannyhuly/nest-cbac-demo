## Description

A **DEMO** [Nest]() API server with **C**laim **B**ased **A**ccess **C**ontrol (CBAC) support using [CASL]().

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

### Integrate In Nest Application

1. Add Middleware to all routes where the CBAC need to be accessible 

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
      .apply(JwtMiddleware, SetCaslAbilitiesMiddleware)
      .forRoutes('*');
  }
}
```

 * **JwtMiddleware** - Set user data on `request` (e.g. `request.user`)
 * **SetCaslAbilitiesMiddleware** - Set user data on `request` (e.g. `request.ability`)


#### Adding Claim Qualifications

When a user make a request a [CASL]() _AppAbility_ is created via the `set-abilities.middleware.ts` () and set on the request.
The _Ability_ is bind to the User JWT value (for condition of `{ userId: user.id }` user.id will be the value in the JWT payload)

There are couple of ways to run a check:

##### Using Decorators

```ts
  // 1. using ClaimsGuard + ClaimQualifications (raw value)
  @UseGuards(ClaimsGuard)
  @ClaimQualifications([Action.Read, 'Cat'])
  @Get()
  async findAll() {
    ...
  }
```

```ts
  // 2. using ClaimsGuard + ClaimQualifications (arrow function)
  @UseGuards(ClaimsGuard)
  @ClaimQualifications((ability: AppAbility) => ability.can(Action.Read, 'Cat'))
  @Get()
  async findAll() {
    ...
  }
```

##### Using Manually  
```ts
  // 3. manual check (using @Ability() to extract AppAbility from request)
  @Get()
  async findAll(@Ability() ability: AppAbility) {
    if(ability.can(Action.Read, 'Cat')) {
      ...
    }
  }
```

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

- [] Load policies CASL from DB
- [] Support DB migrations files (add demo-init seed file)
- [] Encapsulate casl + authz to NestJS Module 
- [] Pagination for `GET /cats` api



  [CASL][https://casl.js.org/v6/en]
  [Nest][https://github.com/nestjs/nest]
