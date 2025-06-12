import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    if (createUserDto.balance < 0) {
      throw new Error('Balance must be a positive number');
    }
    return this.databaseService.user.create({
      data: createUserDto
    })
  }

  async findAllTransactions(userId: number) {
    const sent = await this.databaseService.transaction.findMany({
      where: {
        originId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    const received = await this.databaseService.transaction.findMany({
      where: {
        destinationId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    const all = [...sent, ...received];
  
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
    return all;
  }  

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id
      }
    });
  }
}
