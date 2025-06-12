import { TransactionsService } from './transactions.service';
import { Prisma, Status } from '../../generated/prisma';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: Prisma.TransactionUncheckedCreateInput): Promise<any>;
    findAll(): Promise<{
        id: number;
        originId: number;
        destinationId: number;
        amount: number;
        status: import("../../generated/prisma").$Enums.Status | null;
        createdAt: Date;
    }[]>;
    update(id: string, body: {
        status: Status;
    }): Promise<{
        success: boolean;
        updatedStatus: import("../../generated/prisma").$Enums.Status;
    }>;
}
