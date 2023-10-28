import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private hashSecret = this.configService.get('hash.secret');

  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private configService: ConfigService<typeof configuration>,
  ) {}

  async create(user: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password + this.hashSecret, salt);

    this.userRepository.create({
      username: user.username,
      password: hash,
    });
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }
}
