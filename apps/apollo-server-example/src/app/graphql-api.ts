import { PubSub } from "graphql-subscriptions";

export const typeDefs = `
type Query {
    greeting: String
} 
type Subscription {
    whatTimeNow: Time
}

type Time {
    value: String
}
`;

const pubsub = new PubSub();

export const resolvers = {
  Subscription: {
    whatTimeNow: {
      subscribe: () => pubsub.asyncIterator(['TIME_UPDATED']),
    },
  },
  Query: {
    greeting: () => 'Hello',
  },
};

const interval = setInterval(() => {
  pubsub.publish('TIME_UPDATED', {
    whatTimeNow: {
      value: new Date().toISOString(),
    },
  });
}, 5000);
