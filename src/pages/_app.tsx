import client from '../services/apollo-client';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import { ShortenUrlProvider } from 'react-shorten-url';

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
