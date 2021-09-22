import { apolloClient } from './apollo-client';

describe('apolloClient', () => {
  it('should work', () => {
    expect(apolloClient()).toEqual('apollo-client');
  });
});
