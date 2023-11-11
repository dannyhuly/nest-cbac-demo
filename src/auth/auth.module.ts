import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../config/configuration';
import { AuthzModule } from '../authz';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<typeof configuration>) => ({
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
    }),
    forwardRef(() => UsersModule),
    AuthzModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
