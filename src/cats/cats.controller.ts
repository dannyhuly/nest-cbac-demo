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
import { AuthedRequest } from '../auth/interfaces/auth-request.interface';
import { Claimant, Subjects } from '../authz';
import { ClaimQualifications } from '../authz/authz.utils';
import { CbacGuard, CbacService, Action } from '../modules/cbac';

@ApiBearerAuth()
@UseGuards(CbacGuard)
@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(
    private catsService: CatsService,
    private cbacService: CbacService<Claimant, Subjects>,
  ) {}

  @ClaimQualifications([Action.Create, 'Cat'])
  @Post()
  async create(
    @Body() createCatDto: CreateCatDto,
    @Request() req: AuthedRequest,
  ) {
    this.catsService.create(createCatDto, req.user.id);
  }

  @ClaimQualifications([Action.Read, 'Cat'])
  @Get()
  async findAll() {
    const queryWhere = this.cbacService.toSequelizeQuery(Action.Read, 'Cat');

    return this.catsService.findAll(queryWhere);
  }

  @ClaimQualifications([Action.Update, 'Cat'])
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    const queryWhere = this.cbacService.toSequelizeQuery(Action.Update, 'Cat');

    await this.catsService.update(id, updateCatDto, queryWhere);
  }

  @ClaimQualifications([Action.Delete, 'Cat'])
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const queryWhere = this.cbacService.toSequelizeQuery(Action.Delete, 'Cat');

    await this.catsService.delete(id, queryWhere);
  }
}
