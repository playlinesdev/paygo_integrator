import { Test, TestingModule } from '@nestjs/testing';
import { ApiSettingsService } from './api-settings.service';

describe('ApiSettingsService', () => {
  let service: ApiSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiSettingsService],
    }).compile();

    service = module.get<ApiSettingsService>(ApiSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
