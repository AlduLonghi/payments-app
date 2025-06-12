import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsController } from './transactions/transactions.controller';
import { TransactionsService } from './transactions/transactions.service';

@Module({
  imports: [DatabaseModule, UsersModule, TransactionsModule],
  controllers: [UsersController, TransactionsController],
  providers: [TransactionsService, UsersService],
})
export class AppModule {}
