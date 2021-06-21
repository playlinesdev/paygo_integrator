import { Test, TestingModule } from '@nestjs/testing';
import { PaygoRequestHandlerService } from './paygo-request-handler.service';

describe('PaygoRequestHandlerService', () => {
  let service: PaygoRequestHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaygoRequestHandlerService],
    }).compile();

    service = module.get<PaygoRequestHandlerService>(PaygoRequestHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
