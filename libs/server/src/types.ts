export class HttpError extends Error {
  status: number;
  headers?: { name: string; value: string }[];
  graphqlErrors?: readonly Error[];

  constructor(
    status: number,
    message: string,
    details: {
      headers?: { name: string; value: string }[];
      graphqlErrors?: readonly Error[];
    } = {}
  ) {
    super(message);
    this.status = status;
    this.headers = details.headers;
    this.graphqlErrors = details.graphqlErrors;
  }
}

export interface GraphQLParams {
  operationName?: string;
  query?: string;
  variables?: string | { [name: string]: any };
}

export interface Request {
  body?: any;
  headers: Headers;
  method: string;
  query: any;
}


