import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Prisma } from '../../generated/prisma';
import { Status } from '../../generated/prisma';
import { DatabaseService } from '../database/database.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockDatabaseService = {
    transaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    user: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockDatabaseService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call transactionsService.create with the correct data', async () => {
      const dto: Prisma.TransactionUncheckedCreateInput = {
        originId: 1,
        destinationId: 2,
        amount: 100,
        status: 'PENDING',
      };

      const result = { id: 1, ...dto, createdAt: new Date() };
      mockTransactionsService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockTransactionsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const mockResult = [
        { id: 1, originId: 1, destinationId: 2, amount: 100, status: 'PENDING', createdAt: new Date() },
      ];

      mockTransactionsService.findAll.mockResolvedValue(mockResult);
      expect(await controller.findAll()).toEqual(mockResult);
      expect(mockTransactionsService.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call updateStatus with the right params', async () => {
      const id = '1';
      const body = { status: Status.APPROVED };
      const result = { success: true, updatedStatus: Status.APPROVED };

      mockTransactionsService.updateStatus.mockResolvedValue(result);

      expect(await controller.update(id, body)).toEqual(result);
      expect(mockTransactionsService.updateStatus).toHaveBeenCalledWith(+id, body.status);
    });
  });
});

