import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
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
    const salt = await bcrypt.genSalt(
      this.configService.get('hash.saltRounds'),
    );
    const hash = await bcrypt.hash(user.password + this.hashSecret, salt);

    await this.userRepository.create({
      username: user.username,
      password: hash,
      role: user.role,
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
