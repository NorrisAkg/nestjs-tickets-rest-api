import { Injectable } from '@nestjs/common';
import { UserModel } from 'generated/prisma/models';
import { PrismaService } from 'src/prisma.service';

@Injectable()
/** This service uses prisma to manage db users table */
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }
    findById(id: UserModel["id"]): Promise<UserModel | null> {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }
}
