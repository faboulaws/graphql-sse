import { Module } from '@nestjs/common';
import { GQLModule } from './modules/gql/gql.module';
import { InfoModule } from './modules/info/info.module';

@Module({
  imports: [   
    InfoModule,
    GQLModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
