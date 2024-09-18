import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call findUnique when getting a user by ID', async () => {
    const mockUser = { id: '1', email: 'test@test.com', role: 'USER' };
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const result = await service.findOne('1');
    expect(result).toEqual(mockUser);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      select: { id: true, email: true, role: true },
    });
  });

});