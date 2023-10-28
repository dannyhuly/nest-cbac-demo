import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './database/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    SequelizeModule.forRoot(dataBaseConfig),
    CatsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
