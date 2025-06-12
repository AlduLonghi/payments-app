import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Prisma, Status } from '../../generated/prisma';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findAllTransactions: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call usersService.create with correct dto', async () => {
      const dto: Prisma.UserCreateInput = {
        name: 'John Doe',
        email: 'john@example.com',
        balance: 1000,
      };

      const mockUser = { id: 1, ...dto };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return one user by id', async () => {
      const user = { id: 1, name: 'John', email: 'john@example.com', balance: 1000 };

      mockUsersService.findOne.mockResolvedValue(user);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('getAllTransactions', () => {
    it('should return an array of transactions for a given user ID', async () => {
      const mockTransactions = [
        { id: 1, amount: 100, originId: 1, destinationId: 1, createdAt: new Date, status: Status.APPROVED},
      ];
      const userId = '1'; 
      jest.spyOn(service, 'findAllTransactions').mockResolvedValue(mockTransactions);

      const result = await controller.getAllTransactions(userId);

      expect(service.findAllTransactions).toHaveBeenCalledWith(Number(userId));
      expect(result).toEqual(mockTransactions);
    });

    it('should return an empty array if no transactions are found', async () => {
      const userId = '999'; 
      const mockEmptyTransactions: any[] = [];

      jest.spyOn(service, 'findAllTransactions').mockResolvedValue(mockEmptyTransactions);
      const result = await controller.getAllTransactions(userId);

      expect(service.findAllTransactions).toHaveBeenCalledWith(Number(userId));
      expect(result).toEqual(mockEmptyTransactions);
    });

    it('should handle errors from the service', async () => {
      const userId = '1';
      const errorMessage = 'Transactions not found';

      jest.spyOn(service, 'findAllTransactions').mockRejectedValue(new Error(errorMessage));

      await expect(controller.getAllTransactions(userId)).rejects.toThrow(errorMessage);
      expect(service.findAllTransactions).toHaveBeenCalledWith(Number(userId));
    });
  });
});

