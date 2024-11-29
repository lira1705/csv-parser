import { Test, TestingModule } from '@nestjs/testing';
import { FileManageService } from './fileManage.service';

describe('FileManageService', () => {
  let service: FileManageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileManageService],
    }).compile();

    service = module.get<FileManageService>(FileManageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
