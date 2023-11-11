import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService, CurrentUser } from '../auth';
import { SignInDto } from '../auth';
import { IUser } from '../users';
import { CbacGuard } from '../modules/cbac/cbac.guard';

@ApiTags('account')
@Controller('accounts')
export class AccountController {
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
