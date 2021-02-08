import { Test, TestingModule } from '@nestjs/testing';
import { UserMappingService } from './user-mapping.service';

describe('UserMappingService', () => {
  let service: UserMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMappingService],
    }).compile();

    service = module.get<UserMappingService>(UserMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
