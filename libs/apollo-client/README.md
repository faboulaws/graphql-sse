# @graphql-sse/apollo-client

A client for GraphQL subscription using Server Sent Events.

## Installation

```shell
npm install @graphql-sse/apollo-client
```

## Usage

### Basic Example

The snippet below is from the [Example React App](htts://github.com/faboulaws/grahql-sse/apps/react-app-example) where you have a full working example App.

```typescript
import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { ServerSentEventsLink } from '@graphql-sse/apollo-client';

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