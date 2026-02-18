import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { ttl: 60000, limit: 10 },
      ],
    }),
    UsersModule,
    TicketsModule,
    PrismaModule,
    AuthModule,
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: configService.getOrThrow<string>('MAIL_TRANSPORT'),
        defaults: {
          from: configService.getOrThrow<string>('MAIL_FROM'),
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    RefreshTokenModule,
  ],

  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule { }
