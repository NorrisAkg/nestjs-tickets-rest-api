import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenRepository } from './refresh-token.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('RefreshTokenRepository', () => {
  let repository: RefreshTokenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenRepository,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    repository = module.get<RefreshTokenRepository>(RefreshTokenRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
