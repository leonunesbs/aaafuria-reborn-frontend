import * as gtag from 'lib/gtag';

import { Analytics, Fonts } from '@/components/atoms';
import { ReactNode, useEffect } from 'react';

import { AuthProvider } from '@/contexts/AuthContext';
import { ColorProvider } from '@/contexts/ColorContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { theme } from '@/styles/theme';
import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/provider';
import { createStandaloneToast } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { hotjar } from 'react-hotjar';
import client from '../services/apollo-client';

const ContextProviders = ({ children }: { children: ReactNode }) => {
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
  const { ToastContainer } = createStandaloneToast();

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
    if (process.env.NODE_ENV == 'production') {
      hotjar.initialize(2942033, 6);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <ChakraProvider theme={theme}>
        <Fonts />
        <ApolloProvider client={client}>
          <ContextProviders>
            <Component {...pageProps} />
            <Analytics />
          </ContextProviders>
        </ApolloProvider>
      </ChakraProvider>
    </>
  );
}
