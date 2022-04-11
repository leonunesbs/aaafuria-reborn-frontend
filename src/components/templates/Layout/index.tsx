import { EmailConfirmation, Footer, Header } from '@/components/molecules';
import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

export interface LayoutProps extends BoxProps {
  children: ReactNode;
  title: string;
  desc?: string;
  keywords?: string;
  isHeaded?: boolean;
  isFooted?: boolean;
}

export const Layout = ({
  children,
  title,
  desc,
  keywords,
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
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piauí e aproveite dos nossos produtos, treinos, ensaios, eventos e mais...'
          }
        />
        <meta
          name="keywords"
          content={
            keywords
              ? `${keywords}`
              : 'aaafuria, atlética, fúria, medicina, loja, eventos, intermed'
          }
        />
        <link rel="canonical" href={`https://aaafuria.site${router.asPath}`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://aaafuria.site${router.asPath}`}
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
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piauí e aproveite dos nossos produtos, treinos, ensaios, eventos e mais...'
          }
        />
        <meta property="og:image" content={'/logo-aaafuria-h.webp'} />
        <meta property="og:image:alt" content="logo" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content={`https://aaafuria.site${router.asPath}`}
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
              : 'Plataforma de sócios e loja da Associação Atlética de Medicina Fúria Uniniovafapi. Seja sócio da Maior do Piauí e aproveite dos nossos produtos, treinos, ensaios, eventos e mais...'
          }
        />
        <meta property="twitter:image" content={'/logo-aaafuria-h.webp'} />
        <meta name="twitter:image:alt" content="logo" />
      </Head>
      {isHeaded && <Header />}
      {/* <AlertMessages /> */}
      <Box
        bg={bg}
        minH="100vh"
        py="12"
        px={{ base: '2', lg: '8' }}
        overscrollBehaviorY="none"
      >
        {children}
      </Box>
      {isFooted && <Footer />}
      <EmailConfirmation />
    </>
  );
};
