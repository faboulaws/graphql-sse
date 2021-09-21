import { gql, useSubscription } from '@apollo/client';

const TIME_NOW = gql`
  subscription whatTimeNow {
    whatTimeNow {
      value
    }
  }
`;

export function TimeNow() {
  const { data, loading, error } = useSubscription(TIME_NOW, {
    variables: {},
    shouldResubscribe: false,
    skip:false
  });
  console.log({ data, loading, error });
  if (error) {
    return <h4>Error</h4>;
  }
  return <h4>Time {!loading && data.whatTimeNow.value}</h4>;
}
