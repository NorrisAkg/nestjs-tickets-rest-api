import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from './users.repository';

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, PrismaService],
    exports: [UsersRepository]
})
export class UsersModule { }
