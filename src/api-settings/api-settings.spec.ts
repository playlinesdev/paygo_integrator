import { Test, TestingModule } from '@nestjs/testing';
import { ApiSettings } from './api-settings';

describe('ApiSettings', () => {
  let provider: ApiSettings;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiSettings],
    }).compile();

    provider = module.get<ApiSettings>(ApiSettings);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
