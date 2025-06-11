import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
export declare class DatabaseService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
}
