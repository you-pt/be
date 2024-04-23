import { Test, TestingModule } from '@nestjs/testing';
import { streamListsGateway } from './streamList.gateway';

describe('EventsGateway', () => {
  let gateway: streamListsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [streamListsGateway],
    }).compile();

    gateway = module.get<streamListsGateway>(streamListsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
