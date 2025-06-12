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
    findAll(): string;
    findOne(id: string): Promise<{
        id: number;
        name: string;
        email: string;
        balance: number;
    } | null>;
}
