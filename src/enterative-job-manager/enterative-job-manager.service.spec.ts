import { Test, TestingModule } from '@nestjs/testing';
import { EnterativeJobManagerService } from './enterative-job-manager.service';

describe('EnterativeJobManagerService', () => {
  let service: EnterativeJobManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnterativeJobManagerService],
    }).compile();

    service = module.get<EnterativeJobManagerService>(EnterativeJobManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
