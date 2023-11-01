import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { AuthzModule } from '../authz/authz.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Cat]),
    ConfigModule,
    AuthModule,
    AuthzModule,
  ],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
