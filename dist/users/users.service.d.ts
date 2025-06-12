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
    findAll(): string;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        balance: number;
    } | null>;
}
