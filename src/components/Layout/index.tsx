import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import Head from 'next/head';
import React, { ReactNode } from 'react';

interface LayoutProps extends BoxProps {
  children: ReactNode;
  title?: string;
}

function Layout({ children, title }: LayoutProps) {
  const bg = useColorModeValue('gray.50', 'inherit');

  return (
    <>
      <Head>
        <title>{title ? `@aaafuria | ${title}` : '@aaafuria'}</title>
      </Head>
      <Box bg={bg} minH="100vh" py="12" px={{ base: '4', lg: '8' }}>
        {children}
      </Box>
    </>
  );
}

export default Layout;
