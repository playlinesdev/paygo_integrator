import { Test, TestingModule } from '@nestjs/testing';
import { UserMappingController } from './user-mapping.controller';

describe('UserMappingController', () => {
  let controller: UserMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserMappingController],
    }).compile();

    controller = module.get<UserMappingController>(UserMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
