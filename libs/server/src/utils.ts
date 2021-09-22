export const isAsyncIterable = <T>(
  maybeAsyncIterable: any
): maybeAsyncIterable is AsyncIterable<T> => {
  if (maybeAsyncIterable == null || typeof maybeAsyncIterable !== 'object') {
    return false;
  }
  return typeof maybeAsyncIterable[Symbol.asyncIterator] === 'function';
};

export const isHttpMethod = (
  target: 'GET' | 'POST',
  subject: string
): boolean => {
  return subject.toUpperCase() === target;
};

export const stopAsyncIteration = <T>(
  asyncIterable: AsyncIterable<T>
): void => {
  const method = asyncIterable[Symbol.asyncIterator];
  const asyncIterator = method.call(asyncIterable);
  if (asyncIterator.return) {
    asyncIterator.return();
  }
};
