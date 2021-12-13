import AuthenticatedHomeMenu from '@/components/AuthenticatedHomeMenu';
import CustomButtom from '@/components/CustomButtom';
import CustomChakraNextLink from '@/components/CustomChakraNextLink';
import HomeMenu from '@/components/HomeMenu';
import Layout from '@/components/Layout';
import NextImage from 'next/image';
import PageHeading from '@/components/PageHeading';
import React, { useContext, useState } from 'react';
import SejaSocioButton from '@/components/SejaSocioButton';
import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { MdLogin } from 'react-icons/md';
import { Social } from '@/components/Social';
import {
  Box,
  BoxProps,
  Center,
  chakra,
  Divider,
  Skeleton,
  Stack,
} from '@chakra-ui/react';

type HomeProps = BoxProps;

export default function Home({}: HomeProps) {
  const { isAuthenticated } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const ChakraNextImage = chakra(NextImage);

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
        <Social />
      </Stack>
    </Layout>
  );
}
