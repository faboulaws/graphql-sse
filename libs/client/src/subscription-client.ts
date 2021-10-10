import { fetchEventSource } from '@microsoft/fetch-event-source';
import { ASTNode, DocumentNode, ExecutionResult, print } from 'graphql';

export type SubscriptionClientOptions = {
  graphQlSubscriptionUrl: string;
};

export interface OperationOptions {
  query?: string | DocumentNode;
  variables?: Object;
  operationName?: string;
  [key: string]: any;
}

export interface Observer<T> {
  next?: (value: T) => void;
  error?: (error: Error) => void;
  complete?: () => void;
}

export interface Observable<T> {
  subscribe(observer: Observer<T>): {
    unsubscribe: () => void;
  };
}

export class SubscriptionClient {
  constructor(private options: SubscriptionClientOptions) {}

  private getObserver<T>(
    observerOrNext: Observer<T> | ((v: T) => void),
    error?: (e: Error) => void,
    complete?: () => void
  ) {
    if (typeof observerOrNext === 'function') {
      return {
        next: (v: T) => observerOrNext(v),
        error: (e: Error) => error && error(e),
        complete: () => complete && complete(),
      };
    }

    return observerOrNext;
  }

  subscribe(request: OperationOptions): Observable<ExecutionResult> {
    const { graphQlSubscriptionUrl } = this.options;
    const getObserver = this.getObserver.bind(this);
    return {
      subscribe(onNext: (ev: any) => {}, onError: (err: any) => {}) {
        const observer = getObserver(onNext, onError);
        const payload = { ...request };
        payload.query =
          typeof request.query === 'string'
            ? request.query
            : print(request.query as ASTNode);

        fetchEventSource(graphQlSubscriptionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Connection: 'keep-alive',
            Accept: '*/*',
          },
          body: JSON.stringify(payload),
          onmessage: (ev) => {
            observer.next && observer.next(JSON.parse(ev.data));
          },
          onerror: (err) => {
            observer.error && observer.error(err);
          },
        });

        return {
          unsubscribe() {},
        };
      },
    } as Observable<ExecutionResult>;
  }

  static create(options: SubscriptionClientOptions) {
    return new SubscriptionClient(options);
  }
}
