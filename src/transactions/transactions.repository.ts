import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from './entities';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepo: Repository<Transactions>,
  ) {}

  async findOne(to: string, from: string, amount: number, fileId: number) {
    return await this.transactionsRepo.findOne({
      where: {
        to,
        from,
        amount,
        file: {
          id: fileId,
        },
      },
    });
  }

  async find(filters: { fileId: number }) {
    return await this.transactionsRepo.find({
      where: {
        file: {
          id: filters.fileId,
        },
      },
    });
  }

  createTransaction(data: {
    amount: number;
    fileId: number;
    from: string;
    to: string;
    status: string;
    description?: string;
  }): Transactions {
    return this.transactionsRepo.create({
      amount: data.amount,
      file: { id: data.fileId },
      from: data.from,
      to: data.to,
      status: data.status,
      description: data.description,
    });
  }

  async saveTransaction(transaction: Transactions): Promise<Transactions> {
    return await this.transactionsRepo.save(transaction);
  }
}
