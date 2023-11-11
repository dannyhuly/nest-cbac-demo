import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { User } from '../users/entities/user.entity';
import { WhereOptions } from 'sequelize';
import { ICat } from './interfaces/cat.interface';
import { Op } from 'sequelize';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat) private catRepository: typeof Cat) {}

  create(cat: CreateCatDto, userId: User['id']) {
    // FIXME: cat should be strongly typed
    this.catRepository.create({ ...cat, userId } as any);
  }

  // TODO: Add pagination (or: limit+offset) support
  findAll(queryWhere: WhereOptions<ICat>) {
    return this.catRepository.findAll({
      where: queryWhere,
    });
  }

  async update(
    id: Cat['id'],
    cat: UpdateCatDto,
    queryWhere: WhereOptions<ICat>,
  ) {
    const updateRes = await this.catRepository.update(cat, {
      where: { [Op.and]: [{ id: id }, queryWhere] },
    });

    if (updateRes[0] == 0) {
      throw new NotFoundException();
    }

    return updateRes;
  }

  async delete(id: Cat['id'], queryWhere: WhereOptions<ICat>) {
    const deletedCats = await this.catRepository.destroy({
      where: { [Op.and]: [{ id: id }, queryWhere] },
    });

    if (deletedCats == 0) {
      throw new NotFoundException();
    }
  }
}
