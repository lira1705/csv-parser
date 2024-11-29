import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities';
import { TransactionsRepository } from './transactions.repository';
import { TransactionStatusService } from './transactionStatus.service';
import { TransactionSummaryService } from './transactionsSummary.service';
import { FileManageService } from '../fileManage/fileManage.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly transactionStatusService: TransactionStatusService,
    private readonly transactionsSummaryService: TransactionSummaryService,
    private readonly fileManagerService: FileManageService,
  ) {}

  async saveTransactionFile(data: { filename: string; data: Buffer }) {
    const file = this.filesRepository.create({
      filename: data.filename,
      data: data.data,
    });
    return await this.filesRepository.save(file);
  }

  async doTransaction(
    fileId: number,
    transaction: { from: string; to: string; amount: string },
  ) {
    const transactionStatus = await this.transactionStatusService.defineStatus({
      fileId,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
    });

    const savedTransaction = this.transactionsRepository.createTransaction({
      amount: Number(transaction.amount),
      fileId: fileId,
      from: transaction.from,
      status: transactionStatus.status,
      description: transactionStatus.description,
      to: transaction.to,
    });

    return await this.transactionsRepository.saveTransaction(savedTransaction);
  }

  async processFile(file: Express.Multer.File) {
    const fileBuffer = await this.fileManagerService.readFile(file.filename);

    const savedFile = await this.saveTransactionFile({
      filename: file.filename,
      data: fileBuffer,
    });

    const rows = this.fileManagerService.parseCsv(fileBuffer.toString());

    for (const row of rows) {
      if (this.isTransaction(row)) {
        await this.doTransaction(savedFile.id, {
          from: row.from,
          to: row.to,
          amount: row.amount,
        });
      }
    }

    return this.transactionsSummaryService.getFileSummary(savedFile.id);
  }

  private isTransaction(
    row: unknown,
  ): row is { from: string; to: string; amount: string } {
    return (
      typeof row === 'object' &&
      row !== null &&
      'from' in row &&
      'to' in row &&
      'amount' in row &&
      typeof (row as any).from === 'string' &&
      typeof (row as any).to === 'string' &&
      typeof (row as any).amount === 'string'
    );
  }
}
