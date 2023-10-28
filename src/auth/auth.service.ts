import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { JwtService } from '@nestjs/jwt';
import { IAuthUser } from './interfaces/auth-user.interface';

@Injectable()
export class AuthService {
  private hashSecret = this.configService.get('hash.secret');

  constructor(
    private usersService: UsersService,
    private configService: ConfigService<typeof configuration>,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException();
    }

    const isMatch = await bcrypt.compare(pass + this.hashSecret, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = {
      sub: user.id,
      ...({
        username: user.username,
        rule: user.rule,
      } as IAuthUser),
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
