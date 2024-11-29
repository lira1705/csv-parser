import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { TransactionValidatorService } from './transactionValidator.service';

@Injectable()
export class TransactionStatusService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly transactionValidatorService: TransactionValidatorService,
  ) {}

  async defineStatus(data: {
    fileId: number;
    from: string;
    to: string;
    amount: string;
  }): Promise<{ description?: string; status: string }> {
    const amountInCents = this.toCents(data.amount);

    if (isNaN(amountInCents)) {
      return { status: 'invalid', description: 'invalid amount' };
    }

    if (
      await this.isDuplicatedTransaction(
        data.from,
        data.to,
        amountInCents,
        data.fileId,
      )
    ) {
      return { status: 'invalid', description: 'duplicated' };
    }

    if (this.transactionValidatorService.isTransactionSuspect(amountInCents)) {
      return { status: 'approved', description: 'suspect' };
    }

    if (this.transactionValidatorService.isTransactionNegative(amountInCents)) {
      return { status: 'invalid', description: 'negative' };
    }

    return { status: 'approved' };
  }

  private toCents(amount: string): number {
    return Math.round(Number(amount));
  }

  private async isDuplicatedTransaction(
    from: string,
    to: string,
    amountInCents: number,
    fileId: number,
  ): Promise<boolean> {
    const duplicate = await this.transactionsRepository.findOne(
      to,
      from,
      amountInCents,
      fileId,
    );
    return !!duplicate;
  }
}
