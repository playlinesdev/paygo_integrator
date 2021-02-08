import { Test, TestingModule } from '@nestjs/testing';
import { UserMapping } from './user-mapping';

describe('UserMapping', () => {
  let provider: UserMapping;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMapping],
    }).compile();

    provider = module.get<UserMapping>(UserMapping);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
