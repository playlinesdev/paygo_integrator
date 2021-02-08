import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from './transaction';

describe('Transaction', () => {
  let provider: Transaction;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Transaction],
    }).compile();

    provider = module.get<Transaction>(Transaction);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
