import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CaslToSequelizeRuleService } from './casl-to-sequelize-rule.service';

@Module({
  providers: [CaslAbilityFactory, CaslToSequelizeRuleService],
  exports: [CaslAbilityFactory, CaslToSequelizeRuleService],
})
export class CaslModule {}
