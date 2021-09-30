# @graphql-see/express

This package provide a GraphQL subscription server over Express.

## Installation

```shell
npm install @graphql-sse/express
```

## Basic usage


### Express Example

```typescript
import express, { RequestHandler } from "express";
import {
  getGraphQLParameters,
  processSubscription,
} from "@graphql-sse/server";
import { schema } from "./schema";

const app = express();

app.use(express.json());
const subscriptionServer = SubscriptionServer.create({
    schema,
    app   
});

```

### Apollo Server example

The snippet below is a sample from the [Apollo Server Example App](https://github.com/faboulaws/graphql-sse/tree/main/apps/apollo-server-example]).


```typescript
import { createServer } from 'http';
import { SubscriptionServer } from '@graphql-sse/server';
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
    app   
  });

  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [
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

```
