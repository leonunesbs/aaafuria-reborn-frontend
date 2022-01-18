import Head from 'next/head';
import React, { ReactNode } from 'react';
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { Footer, Header } from '@/components/molecules';
import { useRouter } from 'next/router';

interface LayoutProps extends BoxProps {
  children: ReactNode;
  title?: string;
  desc?: string;
  kw?: string;
  isHeaded?: boolean;
  isFooted?: boolean;
}

export const Layout = ({
  children,
  title,
  desc,
  kw,
  isFooted = true,
  isHeaded = true,
}: LayoutProps) => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{title ? `${title} | @aaafuria` : '@aaafuria'}</title>
        <meta
          name="description"
          content={
            desc
              ? `${desc}`
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piaiuí e aproveite as vantagens.'
          }
        />
        <meta
          name="keywords"
          content={
            kw
              ? `${kw}`
              : 'aaafuria, plataforma, loja, atividades, eventos, atlética, sócio, uninovafapi'
          }
        />
        <link rel="canonical" href={'https://aaafuria.site/'} />

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
        <meta property="og:image:alt" content="calango" />
        <meta property="og:locale" content="pt_BR" />

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
        <meta name="twitter:image:alt" content="calango" />
      </Head>
      {isHeaded && <Header />}
      <Box bg={bg} minH="100vh" py="12" px={{ base: '4', lg: '8' }}>
        {children}
      </Box>
      {isFooted && <Footer />}
    </>
  );
};
