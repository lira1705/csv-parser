import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, Transactions } from './entities';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  async saveTransactionFile(data: { filename: string; data: Buffer }) {
    const file = this.filesRepository.create({
      filename: data.filename,
      data: data.data,
    });
    return await this.filesRepository.save(file);
  }

  async getFileSummary(fileId: number) {
    const transactions = await this.transactionsRepository.find({
      where: {
        file: {
          id: fileId,
        },
      },
    });

    return this.composeTransactionSummary(transactions);
  }

  private composeTransactionSummary(transactions: Transactions[]) {
    const summary = {
      approved: 0,
      reproved: {
        negative: 0,
        duplicated: 0,
      },
      suspects: 0,
    };

    transactions.forEach((transaction) => {
      if (transaction.status === 'approved') {
        if (transaction.description === 'suspect') {
          return summary.suspects++;
        }
        return summary.approved++;
      }
      if ((transaction.status = 'reproved')) {
        if (transaction.description === 'duplicated') {
          return summary.reproved.duplicated++;
        }
        if (transaction.description === 'negative') {
          return summary.reproved.negative++;
        }
      }
    });

    return summary;
  }

  async doTransaction(
    fileId: number,
    transaction: { from: string; to: string; amount: string },
  ) {
    const transactionStatus = await this.defineTransactionStatus({
      fileId,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
    });

    const savedTransaction = this.transactionsRepository.create({
      amount: Number(transaction.amount),
      file: { id: fileId },
      from: transaction.from,
      status: transactionStatus.status,
      description: transactionStatus.description,
      to: transaction.to,
    });

    return await this.transactionsRepository.save(savedTransaction);
  }

  private async defineTransactionStatus(data: {
    fileId: number;
    from: string;
    to: string;
    amount: string;
  }): Promise<{ description?: string; status: string }> {
    const { from, to, amount } = data;

    const amountInCents = Number(amount);

    if (isNaN(amountInCents)) {
      return { status: 'invalid', description: 'invalid amount' };
    }
    if (this.isTransactionSuspect(amountInCents)) {
      return { status: 'approved', description: 'suspect' };
    }

    if (this.isTransactionNegative(amountInCents)) {
      return { status: 'invalid', description: 'negative' };
    }

    const isTransactionDuplicated = await this.isTransactionDuplicated(
      to,
      from,
      amountInCents,
      data.fileId,
    );

    if (isTransactionDuplicated) {
      return { status: 'invalid', description: 'duplicated' };
    }

    return { status: 'valid' };
  }

  private isTransactionSuspect(amount: number) {
    return amount > 5000000;
  }

  private isTransactionNegative(amount: number) {
    return amount < 0;
  }

  private async isTransactionDuplicated(
    to: string,
    from: string,
    amount: number,
    fileId: number,
  ) {
    const repeatedTransaction = await this.transactionsRepository.findOne({
      where: {
        to,
        from,
        amount,
        file: {
          id: fileId,
        },
      },
    });

    return repeatedTransaction;
  }
}
