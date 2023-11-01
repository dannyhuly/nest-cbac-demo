import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { JwtMiddleware } from './auth/jwt.middleware';
import { SetCaslAbilitiesMiddleware } from './authz/casl/set-casl-abilities.middleware';
import { AuthzModule } from './authz/authz.module';
import { DatabaseModule } from './database';

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
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware, SetCaslAbilitiesMiddleware).forRoutes('*');
  }
}
