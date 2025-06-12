"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../generated/prisma");
const database_service_1 = require("../database/database.service");
let TransactionsService = class TransactionsService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async transferBalance(originId, destinationId, amount, status) {
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
    async create(createTransactionDto) {
        let finalStatus;
        if (createTransactionDto.originId === undefined) {
            throw new Error('Origin must be defined');
        }
        if (createTransactionDto.destinationId === undefined) {
            throw new Error('Destination must be defined');
        }
        if (createTransactionDto.amount > 50000) {
            finalStatus = 'PENDING';
        }
        if (createTransactionDto.amount < 50000) {
            finalStatus = 'APPROVED';
        }
        let transaction;
        try {
            transaction = await this.transferBalance(createTransactionDto.originId, createTransactionDto.destinationId, createTransactionDto.amount, finalStatus);
        }
        catch (e) {
            throw new Error(e);
        }
        return transaction;
    }
    async findAll() {
        const transactions = await this.databaseService.transaction.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return transactions;
    }
    async updateStatus(id, status) {
        return await this.databaseService.$transaction(async (tx) => {
            const transaction = await tx.transaction.findUnique({
                where: { id },
            });
            if (!transaction) {
                throw new Error('Transaction not found');
            }
            if (transaction.status !== prisma_1.Status.PENDING) {
                throw new Error('Only pending transactions can be updated');
            }
            await tx.transaction.update({
                where: { id },
                data: { status },
            });
            if (status === prisma_1.Status.APPROVED) {
                await tx.user.update({
                    where: { id: transaction.destinationId },
                    data: {
                        balance: {
                            increment: transaction.amount,
                        },
                    },
                });
            }
            else if (status === prisma_1.Status.REJECTED) {
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
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map