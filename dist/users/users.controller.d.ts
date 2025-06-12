import { UsersService } from './users.service';
import { Prisma } from '../../generated/prisma';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: Prisma.UserCreateInput): Promise<{
        id: number;
        name: string;
        email: string;
        balance: number;
    }>;
    findOne(id: string): Promise<{
        id: number;
        name: string;
        email: string;
        balance: number;
    } | null>;
    getAllTransactions(id: string): Promise<{
        id: number;
        amount: number;
        status: import("../../generated/prisma").$Enums.Status | null;
        createdAt: Date;
        destinationId: number;
        originId: number;
    }[]>;
}
