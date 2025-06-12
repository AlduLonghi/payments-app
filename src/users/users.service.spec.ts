import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '../../generated/prisma';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn()
    },
    transaction: {
      findMany: jest.fn()
    }
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

  describe('findAllTransactions', () => {
    const userId = 1;

    const createMockTransaction = (id: number, type: string, originId: number, destinationId: number, dateString: string) => ({
      id,
      amount: Math.random() * 1000, 
      type,
      originId,
      destinationId,
      createdAt: new Date(dateString),
    });

    it('should return a combined and sorted list of transactions when both sent and received transactions exist', async () => {
      const mockSent = [
        createMockTransaction(101, 'transfer', userId, 2, '2023-01-20T10:00:00Z'),
        createMockTransaction(102, 'payment', userId, 3, '2023-01-15T10:00:00Z'),
      ];

      const mockReceived = [
        createMockTransaction(201, 'deposit', 4, userId, '2023-01-25T11:00:00Z'),
        createMockTransaction(202, 'refund', 5, userId, '2023-01-18T09:00:00Z'),
      ];

      (databaseService.transaction.findMany as jest.Mock)
        .mockResolvedValueOnce(mockSent)
        .mockResolvedValueOnce(mockReceived);

      const result = await service.findAllTransactions(userId);

      expect(databaseService.transaction.findMany).toHaveBeenCalledTimes(2);

      expect(databaseService.transaction.findMany).toHaveBeenCalledWith({
        where: { originId: userId },
        orderBy: { createdAt: 'desc' },
      });

      expect(databaseService.transaction.findMany).toHaveBeenCalledWith({
        where: { destinationId: userId },
        orderBy: { createdAt: 'desc' },
      });

      const expectedSorted = [
        mockReceived[0], 
        mockSent[0],     
        mockReceived[1], 
        mockSent[1],     
      ];

      expect(result).toEqual(expectedSorted);
      expect(result.length).toBe(4);
      expect(result[0].createdAt.getTime()).toBeGreaterThan(result[1].createdAt.getTime());
      expect(result[1].createdAt.getTime()).toBeGreaterThan(result[2].createdAt.getTime());
      expect(result[2].createdAt.getTime()).toBeGreaterThan(result[3].createdAt.getTime());
    });

    it('should return a sorted list when only sent transactions exist', async () => {
      const mockSent = [
        createMockTransaction(101, 'transfer', userId, 2, '2023-01-20T10:00:00Z'),
        createMockTransaction(102, 'payment', userId, 3, '2023-01-15T10:00:00Z'),
      ];

      (databaseService.transaction.findMany as jest.Mock)
        .mockResolvedValueOnce(mockSent)
        .mockResolvedValueOnce([]);

      const result = await service.findAllTransactions(userId);

      expect(databaseService.transaction.findMany).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockSent); 
      expect(result.length).toBe(2);
      expect(result[0].createdAt.getTime()).toBeGreaterThan(result[1].createdAt.getTime());
    });

    it('should return a sorted list when only received transactions exist', async () => {
      const mockReceived = [
        createMockTransaction(201, 'deposit', 4, userId, '2023-01-25T11:00:00Z'),
        createMockTransaction(202, 'refund', 5, userId, '2023-01-18T09:00:00Z'),
      ];

      (databaseService.transaction.findMany as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockReceived);

      const result = await service.findAllTransactions(userId);

      expect(databaseService.transaction.findMany).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockReceived); 
      expect(result.length).toBe(2);
      expect(result[0].createdAt.getTime()).toBeGreaterThan(result[1].createdAt.getTime());
    });

    it('should throw NotFoundException if no transactions are found (both sent and received are empty)', async () => {
      (databaseService.transaction.findMany as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await expect(service.findAllTransactions(userId)).rejects.toThrow(NotFoundException);

      expect(databaseService.transaction.findMany).toHaveBeenCalledTimes(2);
    });
  });
});