import { Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule, GraphQLSchemaHost } from '@nestjs/graphql';
import { GreetingResolver } from './resolvers/greeting.resolver';
import { PubSubService } from './services/pub-sub.service';
import { pubSub, TimeResolver } from './resolvers/time.resolver';
import { CommentResolver } from './resolvers/comment.resolver';
import { SubscriptionServer } from '@graphql-sse/express';
import { HttpAdapterHost } from '@nestjs/core';
import { CommentService } from './services/comment.service';
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true
    }),
  ],
  controllers: [],
  providers: [
    GreetingResolver,
    TimeResolver,
    PubSubService,
    CommentService,
    CommentResolver,
  ],
})
export class GQLModule implements OnModuleInit {
  private subscriptionServer: SubscriptionServer;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private graphQLSchemaHost: GraphQLSchemaHost
  ) {}
  onModuleInit() {
    const schema = this.graphQLSchemaHost.schema;
    const app = this.httpAdapterHost.httpAdapter.getInstance();
    const subscriptionServer = SubscriptionServer.create({
      schema,
      app,
    });

    this.subscriptionServer = subscriptionServer;

    const interval = setInterval(() => {
      pubSub.publish('TIME_UPDATED', {
        whatTimeNow: {
          value: new Date().toISOString(),
        },
      });
    }, 5000);
  }
}
