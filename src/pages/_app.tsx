import client from '../services/apollo-client';
import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as gtag from 'lib/gtag';
import { Analytics } from '@/components/Analytics';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ChakraProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Component {...pageProps} />
          <Analytics />
        </AuthProvider>
      </ApolloProvider>
    </ChakraProvider>
  );
}
