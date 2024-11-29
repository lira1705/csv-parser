import { Injectable } from '@nestjs/common';
import { Transactions } from './entities';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionSummaryService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}
  async getFileSummary(fileId: number) {
    const transactions = await this.transactionsRepository.find({ fileId });
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
}
