import * as express from 'express';
import { processRequest, getGraphQLParameters } from 'graphql-helix';
import { GraphQLSchema } from 'graphql';
import { EventEmitter } from 'events';
import { v4 as generateId } from 'uuid';

export interface ServerOptions {
  app: any;
  schema: GraphQLSchema;
  execute?: (...args: any[]) => any;
  parse?: (...args: any[]) => any;
  subscribe?: (...args: any[]) => any;
  validate?: (...args: any[]) => any;
}

export class SubscriptionServer {
  static create(options: ServerOptions) {
    return new SubscriptionServer(options);
  }

  constructor(options: ServerOptions) {
    const { app, schema } = options;
    app.use(express.json());
    app.post('/graphql-sub', async (req, res) => {
      console.log('posted')

      const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };

      const { operationName, query, variables } = getGraphQLParameters(request);
      const result = await processRequest({
        operationName,
        query,
        variables,
        request: req,
        schema,
      });

      if (result.type === 'RESPONSE') {
        result.headers.forEach(({ name, value }) => res.setHeader(name, value));
        res.status(result.status);
        res.json(result.payload);
      } else if (result.type === 'PUSH') {

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
      } else {
        // throw new Error('Only subscription requests are allowed');
        res.json({ error: 'Only subscription requests are allowed' });
      }
    });

    const eventEmitter = new EventEmitter();

    app.post('/subscribe', async (req, res) => {
      const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };

      const { operationName, query, variables } = getGraphQLParameters(request);
      const result = await processRequest({
        operationName,
        query,
        variables,
        request: req,
        schema,
      });

      const subscriptionId = generateId();
      if (result.type === 'RESPONSE') {
        result.headers.forEach(({ name, value }) => res.setHeader(name, value));
        res.status(result.status);
        res.json(result.payload);
      } else if (result.type === 'PUSH') {
        result.subscribe((result) => {
          eventEmitter.emit(`subscription/${subscriptionId}/data`, result);
        
        });

        eventEmitter.on(`unsubscribe/${subscriptionId}`, () => {
          result.unsubscribe();
        });

        res.json({ subscriptionId });
      } else {
        // throw new Error('Only subscription requests are allowed');
        res.json({ error: 'Only subscription requests are allowed' });
      }
    });

    app.get('/subscriptions/:subscriptionId', (request, response) => {
      const {
        params: { subscriptionId },
      } = request;
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      });

      eventEmitter.on(`subscription/${subscriptionId}/data`, (data) => {
        response.write(`data: ${JSON.stringify(data)}\n\n`);
        console.log({ data: JSON.stringify(data) });
      });

      request.on('close', () => {
        eventEmitter.emit(`unsubscribe/${subscriptionId}`);
      });
    });
  }

  close(){
    console.log('Closing ...')
  }
}
