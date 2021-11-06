import { Test, TestingModule } from '@nestjs/testing';

import { InfoController } from './info.controller';
import { InfoService } from './info.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [InfoController],
      providers: [InfoService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to nestjs-app-example!"', () => {
      const appController = app.get<InfoController>(InfoController);
      expect(appController.getData()).toEqual({
        message: 'Welcome to nestjs-app-example!',
      });
    });
  });
});
