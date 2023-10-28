import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { ICat } from './interfaces/cat.interface';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    this.catsService.update(id, updateCatDto);
  }

  @Get()
  async findAll(): Promise<ICat[]> {
    return this.catsService.findAll();
  }
}
