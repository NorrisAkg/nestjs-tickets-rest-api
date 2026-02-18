import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async findById(id: string): Promise<User> {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return new User(user);
    }

    async update(id: string, data: UpdateUserDto): Promise<User> {
        await this.findById(id);
        const updated = await this.usersRepository.update(id, data);
        return new User(updated);
    }
}
