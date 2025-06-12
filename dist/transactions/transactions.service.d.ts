import { Prisma, Status } from '../../generated/prisma';
import { DatabaseService } from '../database/database.service';
export declare class TransactionsService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    private transferBalance;
    create(createTransactionDto: Prisma.TransactionUncheckedCreateInput): Promise<any>;
    findAll(): Promise<{
        id: number;
        originId: number;
        destinationId: number;
        amount: number;
        status: import("../../generated/prisma").$Enums.Status | null;
        createdAt: Date;
    }[]>;
    updateStatus(id: number, status: Status): Promise<{
        success: boolean;
        updatedStatus: import("../../generated/prisma").$Enums.Status;
    }>;
}
