import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SequelizeModule.forFeature([Cat]), ConfigModule, JwtModule],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
