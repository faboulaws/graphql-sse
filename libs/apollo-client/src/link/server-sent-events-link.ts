import { ApolloLink, Operation, FetchResult, Observable } from '@apollo/client';
import {
  SubscriptionClient,
  SubscriptionClientOptions,
} from '@graphql-sse/client';

export class ServerSentEventsLink extends ApolloLink {
  private subscriptionClient: SubscriptionClient;
  constructor(
    options: SubscriptionClientOptions
  ) {
    super();
    this.subscriptionClient = SubscriptionClient.create(options);
  }

  public request(operation: Operation): Observable<FetchResult> | null {
    return this.subscriptionClient.subscribe(
      operation
    ) as Observable<FetchResult>;
  }
}
