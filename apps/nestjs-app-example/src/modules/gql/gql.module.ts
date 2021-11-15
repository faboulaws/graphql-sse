import { Module, OnModuleInit } from '@nestjs/common';
import { GraphQLModule, GraphQLSchemaHost } from '@nestjs/graphql';
import { PubSubService } from './services/pub-sub.service';
import { CommentResolver } from './comment/comment.resolver';
import { SubscriptionServer } from '@graphql-sse/express';
import { HttpAdapterHost } from '@nestjs/core';
import { CommentService } from './comment/comment.service';
import { PostResolver } from './post/post.resolver';
import { EntityService } from './services/entity.service';
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true
    }),
  ],
  controllers: [],
  providers: [
    PubSubService,
    CommentService,
    CommentResolver,
    PostResolver,
    EntityService
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

  }
}
