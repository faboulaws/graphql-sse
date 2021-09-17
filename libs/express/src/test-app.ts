import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer, Server } from 'http';
import * as express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from './subscription-server';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = createServer(app);

const typeDefs = `
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

const resolvers = {
  Subscription: {
    whatTimeNow: {
      subscribe: () => pubsub.asyncIterator(['TIME_UPDATED']),
    },
  },
};
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

SubscriptionServer.create({ app, schema });

setInterval(() => {
  pubsub.publish('TIME_UPDATED', {
    whatTimeNow: {
      value: new Date().toISOString(),
    },
  });
}, 5000);

const PORT = 4000;
httpServer.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}/graphql`)
);
