import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthedRequest } from '../auth/interfaces/auth-request.interface';
import {
  ClaimsGuard,
  ClaimQualifications,
  CaslToSequelizeRuleService,
  AppAbility,
} from '../authz';
import { Action } from '../authz/casl/action.enum';
import { CaslAbility } from '../authz/casl/casl-ability.decorator';

@ApiBearerAuth()
@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(
    private catsService: CatsService,
    private caslToSequelizeRuleService: CaslToSequelizeRuleService,
  ) {}

  @UseGuards(AuthGuard)
  @UseGuards(ClaimsGuard)
  @ClaimQualifications([Action.Create, 'Cat'])
  @Post()
  async create(
    @Body() createCatDto: CreateCatDto,
    @Request() req: AuthedRequest,
  ) {
    this.catsService.create(createCatDto, req.user.id);
  }

  @UseGuards(ClaimsGuard)
  @ClaimQualifications([Action.Read, 'Cat'])
  @Get()
  async findAll(@CaslAbility() ability: AppAbility) {
    const queryWhere = this.caslToSequelizeRuleService.toSequelizeQuery(
      ability,
      Action.Read,
      'Cat',
    );

    return this.catsService.findAll(queryWhere);
  }

  @UseGuards(AuthGuard)
  @UseGuards(ClaimsGuard)
  @ClaimQualifications([Action.Update, 'Cat'])
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCatDto: UpdateCatDto,
    @CaslAbility() ability: AppAbility,
  ) {
    const queryWhere = this.caslToSequelizeRuleService.toSequelizeQuery(
      ability,
      Action.Update,
      'Cat',
    );

    await this.catsService.update(id, updateCatDto, queryWhere);
  }

  @UseGuards(AuthGuard)
  @UseGuards(ClaimsGuard)
  @ClaimQualifications([Action.Delete, 'Cat'])
  @Delete(':id')
  async delete(@Param('id') id: string, @CaslAbility() ability: AppAbility) {
    const queryWhere = this.caslToSequelizeRuleService.toSequelizeQuery(
      ability,
      Action.Delete,
      'Cat',
    );

    await this.catsService.delete(id, queryWhere);
  }
}
