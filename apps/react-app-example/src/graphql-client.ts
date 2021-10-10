import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { ServerSentEventsLink } from '@graphql-sse/apollo-client';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const sseLink = new ServerSentEventsLink({
  graphQlSubscriptionUrl: 'http://localhost:4000/graphql-subscription',
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

