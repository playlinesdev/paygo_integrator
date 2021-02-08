import { Test, TestingModule } from '@nestjs/testing';
import { PaygoService } from './paygo.service';

describe('PaygoService', () => {
  let service: PaygoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaygoService],
    }).compile();

    service = module.get<PaygoService>(PaygoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
