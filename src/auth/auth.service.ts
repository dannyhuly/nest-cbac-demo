import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { JwtService } from '@nestjs/jwt';
import { IAuthedUser } from './interfaces/auth-user.interface';
import { JwtToken } from './interfaces/jwt-token.type';

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
        id: user.id,
        username: user.username,
        role: user.role,
      } as IAuthedUser),
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyToken(token: JwtToken): Promise<IAuthedUser> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('jwt.secret'),
    });
  }
}
