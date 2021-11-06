import { Module } from '@nestjs/common';

import { InfoController } from './info.controller';
import { InfoService } from './info.service';

@Module({
  imports: [],
  controllers: [InfoController],
  providers: [InfoService],
})
export class InfoModule {}
