import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '../services/apollo-client';

import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </ChakraProvider>
  );
}
