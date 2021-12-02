import React, { useContext, useEffect } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Divider,
  Heading,
  Image,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

import { MdLogin, MdLogout, MdPerson, MdGroups, MdStore } from 'react-icons/md';
import { Card } from '@/components/Card';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { parseCookies } from 'nookies';

type HomeProps = BoxProps;

export default function Home({}: HomeProps) {
  const router = useRouter();
  const { signOut, isAuthenticated, checkSocio } = useContext(AuthContext);

  const { ['aaafuriaIsSocio']: isSocio } = parseCookies();

  useEffect(() => {
    checkSocio();
  }, [checkSocio]);

  return (
    <Box
      bg={useColorModeValue('gray.50', 'inherit')}
      minH="100vh"
      py="12"
      px={{ base: '4', lg: '8' }}
    >
      <Box maxW="xl" mx="auto">
        <Image
          h="180px"
          w="270px"
          objectFit="cover"
          src="/logo-aaafuria-h.png"
          alt="logo"
          mx="auto"
          mb={{ base: '8', md: '12' }}
        />
        <Heading
          as="h1"
          textAlign="center"
          size="xl"
          fontWeight="extrabold"
          mb={4}
        >
          Selecione uma opção
        </Heading>
        <Card>
          <Stack>
            {isSocio !== 'true' && (
              <Button
                leftIcon={<MdGroups size="20px" />}
                colorScheme="green"
                onClick={() => router.push('/sejasocio')}
              >
                Seja Sócio
              </Button>
            )}
            <Button
              leftIcon={<MdStore size="20px" />}
              colorScheme="green"
              onClick={() => router.push('/loja')}
            >
              Loja
            </Button>
            <Divider height="5px" />

            <Button
              leftIcon={<MdPerson size="20px" />}
              colorScheme="green"
              onClick={() => router.push('/areasocio')}
            >
              Área do Sócio
            </Button>
            {isAuthenticated ? (
              <>
                <Button
                  leftIcon={<MdLogout size="20px" />}
                  colorScheme="red"
                  onClick={signOut}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button
                leftIcon={<MdLogin size="20px" />}
                colorScheme="green"
                onClick={() => router.push('/entrar')}
              >
                Entrar
              </Button>
            )}
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
