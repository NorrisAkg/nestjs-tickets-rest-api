import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LogUserDto } from './dto/log-user.dto';
import { AuthGuard } from './auth.guard';
import { User } from 'src/users/entities/user';
import { UserResource } from 'src/users/dto/users.resource.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("register")
    async register(@Body() data: RegisterUserDto) {
        const user = await this.authService.signUp(data);

        return new UserResource(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: LogUserDto) {
        return this.authService.signIn(signInDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req: { user: User }) {
        return req.user;
    }
}
