import {
  CustomButton,
  CustomChakraNextLink,
  PageHeading,
} from '@/components/atoms';
import {
  AuthenticatedHomeMenu,
  Card,
  HomeMenu,
  SocialIcons,
} from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { LoadingContext } from '@/contexts/LoadingContext';
import {
  Badge,
  Box,
  BoxProps,
  Center,
  chakra,
  Divider,
  Skeleton,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { GetStaticProps } from 'next';
import NextImage from 'next/image';
import React, { useContext, useEffect } from 'react';
import { MdHelpCenter, MdLogin } from 'react-icons/md';

type IIndex = BoxProps;

export default function Index({}: IIndex) {
  const { isAuthenticated, matricula } = useContext(AuthContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const ChakraNextImage = chakra(NextImage);

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
              blurDataURL={'/logo-aaafuria-h.webp'}
              layout="fill"
              objectFit="cover"
              src={'/logo-aaafuria-h.webp'}
              quality={1}
              alt="logo"
              mx="auto"
              mb={{ base: '8', md: '12' }}
              draggable={false}
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
                  <CustomButton
                    name="entrar"
                    leftIcon={<MdLogin size="20px" />}
                    onClick={() => {
                      setLoading(true);
                    }}
                  >
                    Entrar
                  </CustomButton>
                </CustomChakraNextLink>
              )}
            </Stack>
          </Card>
        </Skeleton>
        <CustomChakraNextLink href="/ajuda/minhas-solicitacoes">
          <CustomButton
            variant={'solid'}
            leftIcon={<MdHelpCenter size="25px" />}
          >
            Ajuda
          </CustomButton>
        </CustomChakraNextLink>
        <SocialIcons />
      </Stack>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({}) => {
  return {
    props: {},
  };
};
