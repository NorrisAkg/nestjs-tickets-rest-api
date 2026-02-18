import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResource } from './dto/user.resource';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    async getMe(@Request() req: { user: { sub: string } }): Promise<UserResource> {
        const user = await this.usersService.findById(req.user.sub);
        return new UserResource(user);
    }

    @Patch('me')
    async updateMe(
        @Request() req: { user: { sub: string } },
        @Body() data: UpdateUserDto,
    ): Promise<UserResource> {
        const user = await this.usersService.update(req.user.sub, data);
        return new UserResource(user);
    }
}
