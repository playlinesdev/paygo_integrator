import { Test, TestingModule } from '@nestjs/testing';
import { EnterativeJobManager } from './enterative-job-manager';

describe('EnterativeJobManager', () => {
  let provider: EnterativeJobManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnterativeJobManager],
    }).compile();

    provider = module.get<EnterativeJobManager>(EnterativeJobManager);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
