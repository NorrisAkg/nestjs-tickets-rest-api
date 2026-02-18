import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from '../common/public.decorator';
import { UserResource } from 'src/users/dto/user.resource';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Public()
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @Post("register")
    async register(@Body() data: RegisterUserDto): Promise<UserResource> {
        const user = await this.authService.signUp(data);

        return new UserResource(user);
    }

    @Public()
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: LoginDto): Promise<{ user: UserResource, access_token: string, refresh_token: string }> {
        const { user, access_token, refresh_token } = await this.authService.signIn(signInDto);
        const userResource = new UserResource(user);

        return { user: userResource, access_token, refresh_token };
    }

    @Public()
    @Throttle({ default: { ttl: 60000, limit: 5 } })
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Body() body: RefreshTokenDto): Promise<{ access_token: string, refresh_token: string }> {
        return this.authService.refreshTokens(body.refresh_token);
    }

    @Get('profile')
    async getProfile(@Request() req: { user: { sub: string } }): Promise<UserResource> {
        const user = await this.usersService.findById(req.user.sub);
        return new UserResource(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Request() req: { user: { sub: string } }): Promise<{ message: string }> {
        await this.authService.signOut(req.user.sub);
        return { message: 'Logout successful' };
    }
}
