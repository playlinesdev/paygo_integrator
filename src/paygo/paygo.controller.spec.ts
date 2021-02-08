import { Test, TestingModule } from '@nestjs/testing';
import { PaygoController } from './paygo.controller';

describe('PaygoController', () => {
  let controller: PaygoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaygoController],
    }).compile();

    controller = module.get<PaygoController>(PaygoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
