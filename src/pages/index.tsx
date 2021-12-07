import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Center,
  chakra,
  Divider,
  Heading,
  Skeleton,
  Stack,
} from '@chakra-ui/react';

import NextImage from 'next/image';

import { MdLogin, MdLogout, MdPerson, MdGroups, MdStore } from 'react-icons/md';
import { Card } from '@/components/Card';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { parseCookies } from 'nookies';
import Layout from '@/components/Layout';

type HomeProps = BoxProps;

export default function Home({}: HomeProps) {
  const router = useRouter();
  const { signOut, isAuthenticated, checkSocio } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const { ['aaafuriaIsSocio']: isSocio } = parseCookies();

  const ChakraNextImage = chakra(NextImage);

  useEffect(() => {
    checkSocio();
  }, [checkSocio]);

  return (
    <Layout title="Início">
      <Box maxW="xl" mx="auto">
        <Center>
          <Box width="270px" height="180px" position="relative">
            <ChakraNextImage
              placeholder="blur"
              blurDataURL="/logo-aaafuria-h.png"
              layout="fill"
              objectFit="cover"
              src="/logo-aaafuria-h.png"
              quality={1}
              alt="logo"
              mx="auto"
              mb={{ base: '8', md: '12' }}
            />
          </Box>
        </Center>
        <Heading
          as="h1"
          textAlign="center"
          size="xl"
          fontWeight="extrabold"
          mb={4}
        >
          Selecione uma opção
        </Heading>
        <Skeleton isLoaded={!loading}>
          <Card>
            <Stack>
              {isSocio !== 'true' && (
                <Button
                  leftIcon={<MdGroups size="20px" />}
                  colorScheme="green"
                  onClick={() => {
                    setLoading(true);
                    router.push('/sejasocio');
                  }}
                >
                  Seja Sócio
                </Button>
              )}
              <Button
                leftIcon={<MdStore size="20px" />}
                colorScheme="green"
                onClick={() => {
                  setLoading(true);
                  router.push('/loja');
                }}
              >
                Loja
              </Button>
              <Divider height="5px" />

              {isAuthenticated ? (
                <>
                  <Button
                    leftIcon={<MdPerson size="20px" />}
                    colorScheme="green"
                    onClick={() => {
                      setLoading(true);
                      router.push('/areasocio');
                    }}
                  >
                    Área do Sócio
                  </Button>
                  <Button
                    leftIcon={<MdLogout size="20px" />}
                    colorScheme="red"
                    onClick={() => {
                      setLoading(true);
                      signOut();
                    }}
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <Button
                  leftIcon={<MdLogin size="20px" />}
                  colorScheme="green"
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
      </Box>
    </Layout>
  );
}
