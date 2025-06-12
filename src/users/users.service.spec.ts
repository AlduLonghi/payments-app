import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '../../generated/prisma';

describe('UsersService', () => {
  let service: UsersService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw error if balance is negative', async () => {
      const dto: Prisma.UserCreateInput = {
        name: 'Test User',
        email: 'test@example.com',
        balance: -100,
      };

      await expect(service.create(dto)).rejects.toThrow('Balance must be a positive number');
      expect(mockDatabaseService.user.create).not.toHaveBeenCalled();
    });

    it('should create a user if balance is valid', async () => {
      const dto: Prisma.UserCreateInput = {
        name: 'Test User',
        email: 'test@example.com',
        balance: 500,
      };

      const mockUser = { id: 1, ...dto };

      mockDatabaseService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(dto);
      expect(mockDatabaseService.user.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'Test', email: 'test@example.com', balance: 500 };

      mockDatabaseService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(user);
    });
  });
});