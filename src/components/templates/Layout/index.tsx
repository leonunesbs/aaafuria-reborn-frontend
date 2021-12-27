import Head from 'next/head';
import React, { ReactNode } from 'react';
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface LayoutProps extends BoxProps {
  children: ReactNode;
  title?: string;
  desc?: string;
}

export const Layout = ({ children, title, desc }: LayoutProps) => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{title ? `@aaafuria | ${title}` : '@aaafuria'}</title>
        <meta
          name="description"
          content={
            desc
              ? `${desc}`
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piaiuí e aproveite as vantagens.'
          }
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://aaafuria.com.br${router.asPath}`}
        />
        <meta
          property="og:title"
          content={title ? `@aaafuria | ${title}` : '@aaafuria'}
        />
        <meta
          property="og:description"
          content={
            desc
              ? `${desc}`
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piaiuí e aproveite as vantagens.'
          }
        />
        <meta property="og:image" content="/calango-verde.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`https://aaafuria.com.br${router.asPath}`}
        />
        <meta
          property="twitter:title"
          content={title ? `@aaafuria | ${title}` : '@aaafuria'}
        />
        <meta
          property="twitter:description"
          content={
            desc
              ? `${desc}`
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piaiuí e aproveite as vantagens.'
          }
        />
        <meta property="twitter:image" content="/calango-verde.png" />
      </Head>
      <Box bg={bg} minH="100vh" py="12" px={{ base: '4', lg: '8' }}>
        {children}
      </Box>
    </>
  );
};
