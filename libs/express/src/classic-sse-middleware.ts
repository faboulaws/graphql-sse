import { EventEmitter } from 'events';
import { v4 as generateId } from 'uuid';
import { getGraphQLParameters, processSubscription, RESULT_TYPE } from '@graphql-sse/server';

/***
 * This middleware is for classic compatibility with HTML 5 EventSource.
 *  With Event Source where only HTTP GET method is allowed.
 *  Since There is a limit on the number of characters in a URL, 
 *  1. we first receive the subscription query via POST 
 *  2. return a subscriptionId that we can use with GET /subscriptions/:subscriptionId to receive events
 */
function applyMiddleware(app, { schema }) {
    const eventEmitter = new EventEmitter();

    app.post('/subscribe', async (req, res) => {
      const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
      };

      const { operationName, query, variables } = getGraphQLParameters(request);
      const result = await processSubscription({
        operationName,
        query,
        variables,
        request: req,
        schema,
      });

      const subscriptionId = generateId();
      if (result.type === RESULT_TYPE.ERROR) {
        result.headers.forEach(({ name, value }) => res.setHeader(name, value));
        res.status(result.status);
        res.json(result.payload);
      } else if (result.type === RESULT_TYPE.EVENT_STREAM) {
        result.subscribe((result) => {
          eventEmitter.emit(`subscription/${subscriptionId}/data`, result);
        });

        eventEmitter.on(`unsubscribe/${subscriptionId}`, () => {
          result.unsubscribe();
        });

        res.json({ subscriptionId });
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
