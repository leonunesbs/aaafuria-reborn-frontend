import {
  AuthenticatedHomeMenu,
  Card,
  HomeMenu,
  SocialIcons,
} from '@/components/molecules';
import {
  Badge,
  Box,
  BoxProps,
  Center,
  Divider,
  Skeleton,
  Spinner,
  Stack,
  Text,
  chakra,
} from '@chakra-ui/react';
import {
  CustomButtom,
  CustomChakraNextLink,
  PageHeading,
} from '@/components/atoms';
import React, { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { Layout } from '@/components/templates';
import { LoadingContext } from '@/contexts/LoadingContext';
import { MdLogin } from 'react-icons/md';
import NextImage from 'next/image';

type HomeProps = BoxProps;

export default function Home({}: HomeProps) {
  const { isAuthenticated, checkCredentials, matricula } =
    useContext(AuthContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const ChakraNextImage = chakra(NextImage);
  const { green } = useContext(ColorContext);

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 100);
  }, [setLoading]);

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
              blurDataURL={`${process.env.PUBLIC_AWS_URI}/logo-aaafuria-h.webp`}
              layout="fill"
              objectFit="cover"
              src={`${process.env.PUBLIC_AWS_URI}/logo-aaafuria-h.webp`}
              quality={1}
              alt="logo"
              mx="auto"
              mb={{ base: '8', md: '12' }}
            />
          </Box>
        </Center>

        <PageHeading>Selecione uma opção</PageHeading>
        <Center>
          <Badge colorScheme="green" fontSize="md">
            {matricula}
          </Badge>
        </Center>
        <Skeleton isLoaded={!loading}>
          <Card>
            <Stack>
              <HomeMenu />
              <Divider height="5px" />

              {isAuthenticated ? (
                <AuthenticatedHomeMenu />
              ) : (
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
        <Text as="em" textAlign="center">
          Precisa de ajuda?{' '}
          <CustomChakraNextLink
            href="/ajuda/minhas-solicitacoes"
            chakraLinkProps={{
              color: green,
              _hover: {
                textDecoration: 'underline',
              },
            }}
          >
            Clique aqui
          </CustomChakraNextLink>
        </Text>
        <SocialIcons />
      </Stack>
    </Layout>
  );
}
