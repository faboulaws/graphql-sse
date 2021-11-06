import { Test } from '@nestjs/testing';

import { InfoService } from './info.service';

describe('InfoService', () => {
  let service: InfoService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [InfoService],
    }).compile();

    service = app.get<InfoService>(InfoService);
  });

  describe('getData', () => {
    it('should return "Welcome to nestjs-app-example!"', () => {
      expect(service.getData()).toEqual({
        message: 'Welcome to nestjs-app-example!',
      });
    });
  });
});
