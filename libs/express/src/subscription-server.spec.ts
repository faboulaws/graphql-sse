import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer, Server } from 'http';
import * as express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from './subscription-server';
import * as supertest from 'supertest';

describe('SubscriptionServer', () => {
  //   let httpServer: Server;
  let app;
  let interval;
  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // httpServer = createServer(app);
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
      Query: {
        greeting: () => 'Hello',
      },
    };
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    SubscriptionServer.create({ app, schema });

    interval = setInterval(() => {
      pubsub.publish('TIME_UPDATED', {
        whatTimeNow: {
          value: new Date().toISOString(),
        },
      });
    }, 5000);
  });

  afterAll(() => {
    clearInterval(interval);
  });

  it('test', async () => {
    const query = `
    subscription whatTimeNow {
        whatTimeNow {
            value
        }
    }
    `;
    const request: ReturnType<typeof supertest> = supertest(app);
    const response = await request
      .post('/subscribe')
      .set('Accept', 'application/json')
      .send({
        operationName: 'whatTimeNow',
        variables: {},
        query,
      });

    expect(response.status).toBe(200);

    const {
      body: { subscriptionId },
    } = response;
    await request
      .get(`/subscription/${subscriptionId}/data`)
      .buffer()
      .set('Content-Type', 'text/event-stream')
      .parse((res, callback) => {
        res.setEncoding('text/event-stream');
        res.on('data', function (chunk) {
          const data = Buffer.from(chunk, 'binary');
          console.log(data);
        });
      });
  }, 30000);
});
