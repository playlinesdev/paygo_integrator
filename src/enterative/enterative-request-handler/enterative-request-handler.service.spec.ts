import { Test, TestingModule } from '@nestjs/testing';
import { EnterativeRequestHandlerService } from './enterative-request-handler.service';

describe('EnterativeRequestHandlerService', () => {
  let service: EnterativeRequestHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnterativeRequestHandlerService],
    }).compile();

    service = module.get<EnterativeRequestHandlerService>(EnterativeRequestHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
