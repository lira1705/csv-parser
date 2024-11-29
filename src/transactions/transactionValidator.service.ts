import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionValidatorService {
  isTransactionSuspect(amount: number): boolean {
    return amount / 100 > 50000;
  }

  isTransactionNegative(amount: number): boolean {
    return amount < 0;
  }
}
