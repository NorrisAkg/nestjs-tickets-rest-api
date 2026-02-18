import { RefreshTokenRepository } from './../refresh-token/refresh-token.repository';
import { UsersRepository } from 'src/users/users.repository';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { compareHash, hashString } from 'src/common/utils';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'generated/prisma/models';
import { JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION_DAYS } from './constants';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
    private readonly refreshExpirationDays: number;
    private readonly refreshSecret: string;

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.refreshExpirationDays = this.configService.getOrThrow<number>(JWT_REFRESH_EXPIRATION_DAYS);
        this.refreshSecret = this.configService.getOrThrow<string>(JWT_REFRESH_SECRET);
    }

    async signUp(data: RegisterUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ConflictException("An user exists with the given email");
        }

        const hashedPassword = await hashString(data.password);
        const validatedData = { ...data, password: hashedPassword }
        const user = await this.usersRepository.create(validatedData)

        return new User(user);
    }

    async signIn(data: LoginDto): Promise<{ user: User, access_token: string, refresh_token: string }> {
        const userModel = await this.usersRepository.findByEmail(data.email);
        if (!userModel) {
            throw new NotFoundException("User does not exist");
        }
        if (!(await compareHash(data.password, userModel.password))) {
            throw new UnauthorizedException();
        }

        const { access_token, refresh_token } = await this.generateTokens(userModel);

        return { user: new User(userModel), access_token, refresh_token };
    }

    async refreshTokens(refreshToken: string): Promise<{ access_token: string, refresh_token: string }> {
        let payload: { sub: string; email: string };
        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.refreshSecret,
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const storedToken = await this.refreshTokenRepository.findByUserId(payload.sub);
        if (!storedToken) {
            throw new UnauthorizedException('Refresh token revoked');
        }

        const isValid = await compareHash(refreshToken, storedToken.tokenHash);
        if (!isValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.usersRepository.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        await this.refreshTokenRepository.removeTokens(user.id);
        return this.generateTokens(user);
    }

    async signOut(userId: UserModel["id"]): Promise<void> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundException("User does not exist");
        }

        await this.refreshTokenRepository.removeTokens(userId);
    }

    private async generateTokens(user: UserModel): Promise<{ access_token: string, refresh_token: string }> {
        const jwtPayload = { sub: user.id, email: user.email, name: user.name };

        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync({ ...jwtPayload }),
            this.jwtService.signAsync({ ...jwtPayload }, {
                secret: this.refreshSecret,
                expiresIn: `${this.refreshExpirationDays}d` as StringValue,
            }),
        ]);

        const tokenHash = await hashString(refresh_token);
        await this.refreshTokenRepository.create({
            userId: user.id,
            tokenHash,
            expiresAt: new Date(Date.now() + this.refreshExpirationDays * 24 * 60 * 60 * 1000),
        });

        return { access_token, refresh_token };
    }
}
