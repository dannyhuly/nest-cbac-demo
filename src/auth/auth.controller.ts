import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/signIn.dto';
import { IUser } from '../users/interfaces/user.interface';
import { CurrentUser } from './current-user.decorator';
import { CbacGuard } from '../modules/cbac';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @ApiBearerAuth()
  @UseGuards(CbacGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: IUser) {
    return user;
  }
}
