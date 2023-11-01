import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, getConnectionToken } from '@nestjs/sequelize';
import dbConfig from './sequelize.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => ({ sequelizeConfig: dbConfig })],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('sequelizeConfig');
      },
    }),
  ],
  providers: [
    {
      provide: 'SEQUELIZE_CONNECTION',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return getConnectionToken(configService.get('sequelizeConfig'));
      },
    },
  ],
  exports: [SequelizeModule, 'SEQUELIZE_CONNECTION'],
})
export class DatabaseModule {}
