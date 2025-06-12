import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { DatabaseService } from '../database/database.service';
import { Status } from '../../generated/prisma';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let dbService: DatabaseService;

  const mockDbService = {
    $transaction: jest.fn(),
    transaction: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: DatabaseService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return transactions ordered by date', async () => {
      const mockTransactions = [{ id: 1, createdAt: new Date() }];
      mockDbService.transaction.findMany.mockResolvedValue(mockTransactions);

      const result = await service.findAll();

      expect(mockDbService.transaction.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('create', () => {
    it('should throw error if originId is missing', async () => {
      await expect(service.create({ destinationId: 1, amount: 10 } as any))
        .rejects
        .toThrow('Origin must be defined');
    });

    it('should throw error if destinationId is missing', async () => {
      await expect(service.create({ originId: 1, amount: 10 } as any))
        .rejects
        .toThrow('Destination must be defined');
    });

    it('should call transferBalance with APPROVED if amount < 50000', async () => {
      const mockTransfer = jest.fn().mockResolvedValue('tx');
      (service as any).transferBalance = mockTransfer;

      const dto = { originId: 1, destinationId: 2, amount: 1000 };

      const result = await service.create(dto);

      expect(mockTransfer).toHaveBeenCalledWith(1, 2, 1000, 'APPROVED');
      expect(result).toBe('tx');
    });

    it('should call transferBalance with PENDING if amount > 50000', async () => {
      const mockTransfer = jest.fn().mockResolvedValue('tx');
      (service as any).transferBalance = mockTransfer;

      const dto = { originId: 1, destinationId: 2, amount: 51000 };

      const result = await service.create(dto);

      expect(mockTransfer).toHaveBeenCalledWith(1, 2, 51000, 'PENDING');
      expect(result).toBe('tx');
    });
  });

  describe('updateStatus', () => {
    it('should throw if transaction not found', async () => {
      mockDbService.$transaction.mockImplementationOnce(async (cb) => {
        return cb({
          transaction: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        });
      });

      await expect(service.updateStatus(1, Status.APPROVED))
        .rejects
        .toThrow('Transaction not found');
    });

    it('should throw if status is not PENDING', async () => {
      mockDbService.$transaction.mockImplementationOnce(async (cb) => {
        return cb({
          transaction: {
            findUnique: jest.fn().mockResolvedValue({ status: Status.APPROVED }),
          },
        });
      });

      await expect(service.updateStatus(1, Status.REJECTED))
        .rejects
        .toThrow('Only pending transactions can be updated');
    });

    it('should update balance and status correctly on APPROVED', async () => {
      const updateMock = jest.fn();
      mockDbService.$transaction.mockImplementationOnce(async (cb) => {
        return cb({
          transaction: {
            findUnique: jest.fn().mockResolvedValue({
              id: 1,
              status: Status.PENDING,
              destinationId: 2,
              originId: 1,
              amount: 100,
            }),
            update: updateMock,
          },
          user: {
            update: updateMock,
          },
        });
      });

      const result = await service.updateStatus(1, Status.APPROVED);

      expect(updateMock).toHaveBeenCalled();
      expect(result).toEqual({ success: true, updatedStatus: Status.APPROVED });
    });
  });
});

