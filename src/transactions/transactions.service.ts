import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Status } from '../../generated/prisma';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async transferBalance(originId: number, destinationId: number, amount: number, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
    return await this.databaseService.$transaction(async (tx) => {
      const originUser = await tx.user.findUnique({
        where: { id: originId },
      });
  
      if (!originUser) {
        throw new Error('Origin user not found');
      }

      const destinationUser = await tx.user.findUnique({
        where: { id: destinationId },
      });
  
      if (!destinationUser) {
        throw new Error('Destination user not found');
      }
  
      if (originUser.balance < amount) {
        throw new Error('Insufficient balance');
      }
  
      await tx.user.update({
        where: { id: originId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
  
      if (status !== 'PENDING') {
        await tx.user.update({
          where: { id: destinationId },
          data: {
            balance: {
              increment: amount,
            },
          },
        });
      }
  
      const transaction = await tx.transaction.create({
        data: {
          originId,
          destinationId,
          amount,
          status, 
        },
      });
  
      return transaction;
    });
  }

  async create(createTransactionDto: Prisma.TransactionUncheckedCreateInput) {
    let finalStatus;
    // originId MUST exist
    if (createTransactionDto.originId === undefined) {
      throw new Error('Origin must be defined');
    }

    // destinationId MUST exist
    if (createTransactionDto.destinationId === undefined) {
      throw new Error('Destination must be defined');
    }

    // if import is > 50.000 status should be set to pending
    if (createTransactionDto.amount > 50000) {
      finalStatus = 'PENDING'
    }

    // if import is < 50.000 status should be set to approved
    if (createTransactionDto.amount < 50000) {
      finalStatus = 'APPROVED'
    }

    let transaction;
    try {
      transaction = await this.transferBalance(createTransactionDto.originId, createTransactionDto.destinationId, createTransactionDto.amount, finalStatus)
    } catch (e) {
      throw new Error(e)
    }

    return transaction;
  }

  async findAll() {
    const transactions = await this.databaseService.transaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

      if (transactions.length === 0) {
          throw new NotFoundException(`Transactions not found.`);
        }
    
    return transactions;
  }

  async updateStatus(id: number, status: Status) {
    return await this.databaseService.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id },
      });
  
      if (!transaction) {
        throw new Error('Transaction not found');
      }
  
      if (transaction.status !== Status.PENDING) {
        throw new Error('Only pending transactions can be updated');
      }

      await tx.transaction.update({
        where: { id },
        data: { status },
      });
  
      if (status === Status.APPROVED) {
        await tx.user.update({
          where: { id: transaction.destinationId },
          data: {
            balance: {
              increment: transaction.amount,
            },
          },
        });
      } else if (status === Status.REJECTED) {
        await tx.user.update({
          where: { id: transaction.originId },
          data: {
            balance: {
              increment: transaction.amount,
            },
          },
        });
      }
  
      return { success: true, updatedStatus: status };
    });
  }
}
