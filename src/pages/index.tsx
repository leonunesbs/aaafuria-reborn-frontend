import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Center,
  chakra,
  Divider,
  Skeleton,
  Stack,
} from '@chakra-ui/react';

import NextImage from 'next/image';

import { MdLogin } from 'react-icons/md';
import { Card } from '@/components/Card';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { parseCookies } from 'nookies';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import AuthenticatedHomeMenu from '@/components/AuthenticatedHomeMenu';
import HomeMenu from '@/components/HomeMenu';
import { Social } from '@/components/Social';
import SejaSocioButton from '@/components/SejaSocioButton';

type HomeProps = BoxProps;

export default function Home({}: HomeProps) {
  const router = useRouter();
  const { isAuthenticated, checkSocio } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const { ['aaafuriaIsSocio']: isSocio } = parseCookies();

  const ChakraNextImage = chakra(NextImage);

  useEffect(() => {
    checkSocio();
  }, [checkSocio]);

  return (
    <Layout title="Início">
      <Stack maxW="xl" mx="auto" spacing={4}>
        <Center>
          <Box width="270px" height="180px" position="relative">
            <ChakraNextImage
              placeholder="blur"
              blurDataURL="/logo-aaafuria-h.webp"
              layout="fill"
              objectFit="cover"
              src="/logo-aaafuria-h.webp"
              quality={1}
              alt="logo"
              mx="auto"
              mb={{ base: '8', md: '12' }}
            />
          </Box>
        </Center>
        <PageHeading>Selecione uma opção</PageHeading>
        <Skeleton isLoaded={!loading}>
          <Card>
            <Stack>
              {isSocio !== 'true' && (
                <SejaSocioButton setLoading={setLoading} />
              )}

              <HomeMenu setLoading={setLoading} />
              <Divider height="5px" />

              {isAuthenticated && (
                <AuthenticatedHomeMenu setLoading={setLoading} />
              )}
              {!isAuthenticated && (
                <Button
                  as="h2"
                  leftIcon={<MdLogin size="20px" />}
                  colorScheme="green"
                  variant="ghost"
                  onClick={() => {
                    setLoading(true);
                    router.push('/entrar');
                  }}
                >
                  Entrar
                </Button>
              )}
            </Stack>
          </Card>
        </Skeleton>
        <Social />
      </Stack>
    </Layout>
  );
}
