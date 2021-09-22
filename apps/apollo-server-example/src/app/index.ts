import { createServer } from 'http';
// import { execute, subscribe, parse, validate } from 'graphql';
import { SubscriptionServer } from 'libs/express/src';
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql-api';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

export async function startApp() {
  const app = express();

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create({
    schema,
    app,
    // execute,
    // subscribe,
    // parse,
    // validate,
  });

  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
}
