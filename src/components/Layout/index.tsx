import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import Head from 'next/head';
import React, { ReactNode } from 'react';

interface LayoutProps extends BoxProps {
  children: ReactNode;
  title?: string;
  desc?: string;
}

function Layout({ children, title, desc }: LayoutProps) {
  const bg = useColorModeValue('gray.50', 'inherit');

  return (
    <>
      <Head>
        <title>{title ? `@aaafuria | ${title}` : '@aaafuria'}</title>
        <meta
          name="description"
          content={
            desc
              ? `${desc}`
              : 'Plataforma de sócios e loja da Associação Atlética de medicina Fúria Uniniovafapi. Seja sócio da Maior do Piaiuí e aproveite as vantagens.'
          }
        />
      </Head>
      <Box bg={bg} minH="100vh" py="12" px={{ base: '4', lg: '8' }}>
        {children}
      </Box>
    </>
  );
}

export default Layout;
