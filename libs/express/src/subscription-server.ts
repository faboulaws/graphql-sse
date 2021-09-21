import * as express from 'express';
import { GraphQLSchema } from 'graphql';

import {
  getGraphQLParameters,
  processSubscription,
  RESULT_TYPE,
} from '@graphql-sse/server';

export interface ServerOptions {
  app: any;
  schema: GraphQLSchema;
  path?: string;
}

export class SubscriptionServer {
  static create(options: ServerOptions) {
    return new SubscriptionServer(options);
  }

  constructor(options: ServerOptions) {
    const { app, schema, path = '/graphql-subscription' } = options;
    this.applyMiddleware(app, { schema, path });
  }

  applyMiddleware(app, { schema, path }) {
    app.use(express.json());
    app.post(path, async (req, res, next) => {
      const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };

      const { operationName, query, variables } = getGraphQLParameters(request);
      if (!query) {
        return next();
      }
      const result = await processSubscription({
        operationName,
        query,
        variables,
        request: req,
        schema,
      });

      if (result.type === RESULT_TYPE.NOT_SUBSCRIPTION) {
        return next();
      } else if (result.type === RESULT_TYPE.ERROR) {
        result.headers.forEach(({ name, value }) => res.setHeader(name, value));
        res.status(result.status);
        res.json(result.payload);
      } else if (result.type === RESULT_TYPE.EVENT_STREAM) {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          Connection: 'keep-alive',
          'Cache-Control': 'no-cache',
        });

        result.subscribe((data) => {
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        });

        req.on('close', () => {
          result.unsubscribe();
        });
      }
    });
  }

  close() {
    console.log('Closing ...');
  }
}
