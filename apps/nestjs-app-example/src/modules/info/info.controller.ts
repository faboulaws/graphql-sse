import { Controller, Get } from '@nestjs/common';

import { InfoService } from './info.service';

@Controller()
export class InfoController {
  constructor(private readonly appService: InfoService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
