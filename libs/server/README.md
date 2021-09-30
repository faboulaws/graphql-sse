# @graphql-sse/server

This package provide utility function for implementing GraphQL Subscriptions transport over Server Send Events. This package is inspired by the awesome [GraphQL Helix](https://github.com/contrawork/graphql-helix).

## Installation

```shell
npm install @graphql-sse/server
```

## Basic usage

Here is a simple example of how to use it with express. Alternatively you can use the `@graphql-sse/express` package.

```typescript
import express, { RequestHandler } from "express";
import {
  getGraphQLParameters,
  processSubscription,
} from "@graphql-sse/server";
import { schema } from "./schema";

const app = express();

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
```
