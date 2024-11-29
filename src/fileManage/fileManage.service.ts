import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';

@Injectable()
export class FileManageService {
  async readFile(filename: string): Promise<Buffer> {
    return readFileSync(`files/${filename}`);
  }

  parseCsv(csvData: string): { from: string; to: string; amount: string }[] {
    const parsed = parse(csvData, {
      header: true,
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
    });
    return parsed.data as { from: string; to: string; amount: string }[];
  }
}
