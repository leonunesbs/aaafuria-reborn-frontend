import {
  ApolloClient,
  createHttpLink,
  DefaultOptions,
  InMemoryCache,
} from '@apollo/client';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  },
};

const httpLink = createHttpLink({
  uri: 'https://backend.aaafuria.site/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  defaultOptions: defaultOptions,
});

export default client;
