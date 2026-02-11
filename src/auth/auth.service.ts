import { UsersRepository } from 'src/users/users.repository';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/users/entities/user';
import { LogUserDto } from './dto/log-user.dto';
import { compareHash, hashString } from 'src/common/utils';

@Injectable()
export class AuthService {
    constructor(private readonly usersRepository: UsersRepository) {

    }

    async signUp(data: RegisterUserDto) {
        const existingUser = await this.usersRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ConflictException("An user exists with the given email");
        }

        const hashedPassword = await hashString(data.password);
        const validatedData = { ...data, password: hashedPassword }
        const user = await this.usersRepository.create(validatedData)

        return new User(user);
    }

    async signIn(data: LogUserDto): Promise<any> {
        const user = await this.usersRepository.findByEmail(data.email);
        if (!user) {
            throw new NotFoundException("User does not exist");
        }
        if (await compareHash(data.password, user?.password!)) {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        // TODO: Generate a JWT and return it here

        // instead of the user object
        return result;
    }
}
