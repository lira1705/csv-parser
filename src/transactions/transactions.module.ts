import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File, Transactions } from './entities';
import { TransactionValidatorService } from './transactionValidator.service';
import { TransactionsRepository } from './transactions.repository';
import { TransactionSummaryService } from './transactionsSummary.service';
import { TransactionStatusService } from './transactionStatus.service';
import { FileManageModule } from 'src/fileManage/fileManage.module';

@Module({
  imports: [TypeOrmModule.forFeature([File, Transactions]), FileManageModule],
  providers: [
    TransactionsService,
    TransactionValidatorService,
    TransactionsRepository,
    TransactionSummaryService,
    TransactionStatusService,
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
