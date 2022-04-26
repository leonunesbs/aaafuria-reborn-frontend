import * as gtag from 'lib/gtag';

import { Analytics, Fonts } from '@/components/atoms';
import React, { useEffect } from 'react';

import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChakraProvider } from '@chakra-ui/provider';
import { ColorProvider } from '@/contexts/ColorContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import client from '../services/apollo-client';
import { hotjar } from 'react-hotjar';
import { theme } from '@/styles/theme';
import { useRouter } from 'next/router';

const ContextProviders: React.FC = ({ children }) => {
  return (
    <LoadingProvider>
      <ColorProvider>
        <AuthProvider>{children}</AuthProvider>
      </ColorProvider>
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

  useEffect(() => {
    hotjar.initialize(2942033, 6);
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <ApolloProvider client={client}>
        <ContextProviders>
          <Component {...pageProps} />
          <Analytics />
        </ContextProviders>
      </ApolloProvider>
    </ChakraProvider>
  );
}
