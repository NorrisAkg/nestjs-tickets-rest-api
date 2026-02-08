import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { TicketsModule } from './tickets/tickets.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UsersModule,
    TicketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }