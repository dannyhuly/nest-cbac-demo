import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cat } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat) private catRepository: typeof Cat) {}

  create(cat: CreateCatDto, userId: User['id']) {
    // FIXME: cat should be strongly typed
    this.catRepository.create({ ...cat, userId } as any);
  }
  update(id: Cat['id'], cat: UpdateCatDto) {
    // FIXME: cat should be strongly typed
    this.catRepository.update(cat as any, {
      where: {
        id: id,
      },
    });
  }

  findAll() {
    return this.catRepository.findAll();
  }
}
