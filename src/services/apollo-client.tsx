import {
  ApolloClient,
  createHttpLink,
  DefaultOptions,
  InMemoryCache,
} from '@apollo/client';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const httpLink = createHttpLink({
  uri: 'http://192.168.1.110:8000/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  defaultOptions: defaultOptions,
});

export default client;
