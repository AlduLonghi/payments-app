import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Prisma, Status } from '../../generated/prisma';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: Prisma.TransactionUncheckedCreateInput) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Patch(':id/updateStatus')
  update(@Param('id') id: string, @Body() body: { status: Status }) {
    return this.transactionsService.updateStatus(+id, body.status);
  }
}
