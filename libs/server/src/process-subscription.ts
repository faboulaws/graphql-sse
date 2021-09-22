import {  
  subscribe,
  parse,
  validate,  
  getOperationAST,
  ExecutionResult,
  GraphQLError,
} from 'graphql';
import { GraphQLParams, Request, HttpError } from './types';
import { isAsyncIterable, isHttpMethod, stopAsyncIteration } from './utils';

export enum RESULT_TYPE {
  EVENT_STREAM = 'EVENT_STREAM',
  ERROR = 'ERROR',
  NOT_SUBSCRIPTION = 'NOT_SUBSCRIPTION',
}

export const getGraphQLParameters = (request: Request): GraphQLParams => {
  const { body, method, query: queryParams } = request;

  let operationName;
  let query;
  let variables;

  if (isHttpMethod('GET', method)) {
    operationName = queryParams.operationName;
    query = queryParams.query;
    variables = queryParams.variables;
  } else if (isHttpMethod('POST', method)) {
    operationName = body?.operationName;
    query = body?.query;
    variables = body?.variables;
  }

  return {
    operationName,
    query,
    variables,
  };
};

export async function processSubscription({
  operationName,
  query,
  variables,
  request,
  schema,
}) {
  try {
      // Parse
    let document;
    try {
      document =
        typeof query !== 'string' && query.kind === 'Document'
          ? query
          : parse(query);
    } catch (syntaxError) {
      throw new HttpError(
        400,
        'Unexpected error encountered while executing GraphQL request.',
        {
          graphqlErrors: [syntaxError],
        }
      );
    }

    // Validate
    const validationErrors = validate(schema, document);
    if (validationErrors.length > 0) {
      throw new HttpError(
        400,
        'Unexpected error encountered while executing GraphQL request.',
        {
          graphqlErrors: validationErrors,
        }
      );
    }

    const operation = getOperationAST(document, operationName);

    if (!operation) {
      if (!operation) {
        throw new HttpError(
          400,
          'Could not determine what operation to execute.'
        );
      }
    }

    if (operation.operation !== 'subscription') {
      return { type: RESULT_TYPE.NOT_SUBSCRIPTION };
    }

    const result = await subscribe({
      schema,
      document,
      operationName,
      variableValues: variables,
    });

    if (isAsyncIterable<ExecutionResult>(result)) {
      return {
        type: RESULT_TYPE.EVENT_STREAM,
        subscribe: async (onResult) => {
          for await (const payload of result) {
            onResult(payload);
          }
        },
        unsubscribe: () => {
          stopAsyncIteration(result);
        },
      };
    } else {
      return {
        type: RESULT_TYPE.EVENT_STREAM,
        subscribe: async (onResult) => {
          onResult(result);
        },
        unsubscribe: () => undefined,
      };
    }
  } catch (error) {
    const payload = {
      errors: error.graphqlErrors || [new GraphQLError(error.message)],
    };
    return {
      type: RESULT_TYPE.ERROR,
      status: error.status || 500,
      headers: error.headers || [],
      payload,
    };
  }
}
