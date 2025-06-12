import { Prisma } from '../../generated/prisma';
import { DatabaseService } from '../database/database.service';
export declare class UsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(createUserDto: Prisma.UserCreateInput): Promise<{
        id: number;
        name: string;
        email: string;
        balance: number;
    }>;
    findAllTransactions(userId: number): Promise<{
        id: number;
        amount: number;
        status: import("../../generated/prisma").$Enums.Status | null;
        createdAt: Date;
        destinationId: number;
        originId: number;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        balance: number;
    } | null>;
}
