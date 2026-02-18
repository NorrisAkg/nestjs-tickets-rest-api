import { Injectable } from '@nestjs/common';
import { RefreshTokenModel, UserModel } from 'generated/prisma/models';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(data: { userId: string; tokenHash: string; expiresAt: Date }): Promise<RefreshTokenModel> {
        return this.prisma.refreshToken.create({ data });
    }

    findByUserId(userId: UserModel["id"]): Promise<RefreshTokenModel | null> {
        return this.prisma.refreshToken.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    removeTokens(userId: UserModel["id"]): Promise<Prisma.BatchPayload> {
        return this.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
}
