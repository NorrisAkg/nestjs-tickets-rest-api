import { Injectable } from '@nestjs/common';
import { UserModel } from 'generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
/** This service uses prisma to manage db users table */
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }
    findById(id: UserModel["id"]): Promise<UserModel | null> {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    /**
     * Finds a user by its email.
     * @param {string} email - the user email to find.
     * @returns {Promise<UserModel | null>} - a promise that resolves with the found user or null if not found.
     */
    findByEmail(email: UserModel["email"]): Promise<UserModel | null> {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }

    create(data: CreateUserDto): Promise<UserModel> {
        return this.prisma.user.create({ data });
    }
}
