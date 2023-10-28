import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createCatDto: CreateCatDto,
    @Request() req: AuthRequest,
  ) {
    this.catsService.create(createCatDto, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    this.catsService.update(id, updateCatDto);
  }

  @Get()
  async findAll() {
    return this.catsService.findAll();
  }
}
