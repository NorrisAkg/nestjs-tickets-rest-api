import { JWT_SECRET, JWT_ACCESS_EXPIRATION } from './constants';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import type { StringValue } from 'ms';

@Module({
  imports: [
    UsersModule,
    RefreshTokenModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>(JWT_SECRET),
        signOptions: { expiresIn: configService.getOrThrow<string>(JWT_ACCESS_EXPIRATION) as StringValue },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
