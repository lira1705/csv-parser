import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import { diskStorage } from 'multer';
import { parse } from 'papaparse';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file_asset', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const savedFile = this.transactionsService.saveTransactionFile({
      filename: file.filename,
      data: file.buffer,
    });

    const csvFile = readFileSync(`files/csv.csv`);
    const csvData = csvFile.toString();

    const parsedCSV = parse(csvData, {
      header: true,
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });

    const isTransaction = (
      row: unknown,
    ): row is { from: string; amount: string; to: string } => {
      return (
        typeof row === 'object' &&
        typeof row.to === 'string' &&
        typeof row.from === 'string' &&
        typeof row.amount === 'string'
      );
    };

    parsedCSV.data.forEach((row) =>
      this.transactionsService.doTransaction(file.destination, {
        from: row.from,
        to: row.to,
        amount: row.amount,
      }),
    );
  }
}
