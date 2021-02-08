import { Test, TestingModule } from '@nestjs/testing';
import { ApiSettingsController } from './api-settings.controller';

describe('ApiSettingsController', () => {
  let controller: ApiSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiSettingsController],
    }).compile();

    controller = module.get<ApiSettingsController>(ApiSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
