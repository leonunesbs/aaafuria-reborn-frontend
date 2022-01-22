import { Analytics } from '@/components/atoms';
import { AuthProvider } from '@/contexts/AuthContext';
import { theme } from '@/styles/theme';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/provider';
import * as gtag from 'lib/gtag';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import client from '../services/apollo-client';

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
        <AuthProvider>
          <Component {...pageProps} />
          <Analytics />
        </AuthProvider>
      </ApolloProvider>
    </ChakraProvider>
  );
}
