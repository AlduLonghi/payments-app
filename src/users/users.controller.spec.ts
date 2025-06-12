import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Prisma } from '../../generated/prisma';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
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

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, name: 'John', email: 'john@example.com', balance: 1000 },
        { id: 2, name: 'Jane', email: 'jane@example.com', balance: 2000 },
      ];

      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
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
});

