import * as gtag from 'lib/gtag';

import React, { useEffect } from 'react';

import { Analytics } from '@/components/atoms';
import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChakraProvider } from '@chakra-ui/provider';
import { LoadingProvider } from '@/contexts/LoadingContext';
import client from '../services/apollo-client';
import { theme } from '@/styles/theme';
import { useRouter } from 'next/router';

const ContextProviders: React.FC = ({ children }) => {
  return (
    <LoadingProvider>
      <AuthProvider>{children}</AuthProvider>
    </LoadingProvider>
  );
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV == 'production') {
      const handleRouteChange = (url: URL) => {
        gtag.pageview(url);
      };
      router.events.on('routeChangeComplete', handleRouteChange);
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router.events]);

  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <ContextProviders>
          <Component {...pageProps} />
          <Analytics />
        </ContextProviders>
      </ApolloProvider>
    </ChakraProvider>
  );
}
