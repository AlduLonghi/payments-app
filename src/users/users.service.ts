import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';

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

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return `This action updates a #${id} user`;
  }
}
