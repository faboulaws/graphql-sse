# @graphql-sse/client

A client for GraphQL subscription using Server Sent Events.

## Installation

```shell
npm install @graphql-sse/client
```

## Usage

### Basic Example

```typescript
import {
  SubscriptionClient,
  SubscriptionClientOptions,
} from '@graphql-sse/client';

const subscriptionClient = SubscriptionClient.create({
    graphQlSubscriptionUrl: 'http://some.host/graphl/subscriptions'
});

subscriptionClient.subscribe(
    operation
)    
```

### Apollo client example

In the example we will create a `Apollo Client` link that we we later use when initializing our apollo client.

```typescript
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
```

Now we can use the created Apollo Client Link for subscriptions.

```typescript
import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { ServerSentEventsLink } from './server-sent-events-link';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const sseLink = new ServerSentEventsLink({
  graphQlSubscriptionUrl: 'http://localhost:4000/graphql',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  sseLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

```

**Note:** Alternatively, you can use the [`@graphql-sse/apollo-client`](https://github.com/faboulaws/graphql-sse/tree/main/libs/apollo-client) that wraps this `@graphql-sse/client`. See the  [Example React App](https://github.com/faboulaws/graphql-sse/tree/main/apps/react-app-example)
