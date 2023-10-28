import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './database/database.config';

@Module({
  imports: [SequelizeModule.forRoot(dataBaseConfig), CatsModule],
})
export class AppModule {}
