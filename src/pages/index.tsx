import {
  CustomButtom,
  CustomChakraNextLink,
  PageHeading,
  SejaSocioButton,
} from '@/components/atoms';
import {
  AuthenticatedHomeMenu,
  Card,
  HomeMenu,
  SocialIcons,
} from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import {
  Box,
  BoxProps,
  Center,
  chakra,
  Divider,
  Skeleton,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { MdLogin } from 'react-icons/md';

type HomeProps = BoxProps;

export default function Home({}: HomeProps) {
  const { isAuthenticated, checkCredentials } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const ChakraNextImage = chakra(NextImage);

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  if (loading) {
    return (
      <Layout title="Início" isHeaded={false} isFooted={false} h="100vh">
        <Center h="100vh" flexDir="row">
          <Spinner size="xl" color="green" />
        </Center>
      </Layout>
    );
  }

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
              <SejaSocioButton setLoading={setLoading} />
              <HomeMenu setLoading={setLoading} />
              <Divider height="5px" />

              {isAuthenticated && (
                <AuthenticatedHomeMenu setLoading={setLoading} />
              )}
              {!isAuthenticated && (
                <CustomChakraNextLink href="/entrar">
                  <CustomButtom
                    name="entrar"
                    leftIcon={<MdLogin size="20px" />}
                    onClick={() => {
                      setLoading(true);
                    }}
                  >
                    Entrar
                  </CustomButtom>
                </CustomChakraNextLink>
              )}
            </Stack>
          </Card>
        </Skeleton>
        <SocialIcons />
      </Stack>
    </Layout>
  );
}
