import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthzModule } from './authz/authz.module';
import { DatabaseModule } from './database';
import { CbacMiddleware } from './authz/authz.utils';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
    CatsModule,
    UsersModule,
    AuthModule,
    AuthzModule,
    AccountModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware, CbacMiddleware).forRoutes('*');
  }
}
