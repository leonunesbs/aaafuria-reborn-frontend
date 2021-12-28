import { PageHeading } from '@/components/atoms';
import { Card, AreaSocioMenu } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, useToast, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React, { useContext, useEffect } from 'react';

function AreaSocio() {
  const router = useRouter();
  const { checkCredentials, isSocio } = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  useEffect(() => {
    if (!isSocio) {
      toast({
        description: 'Você não tem permissão para acessar esta área.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/sejasocio');
    }
  }, [isSocio, router, toast]);

  return (
    <Layout title="Área do Socio">
      <Box maxW="xl" mx="auto">
        <PageHeading>Área do sócio</PageHeading>
        <Text textAlign="center" mb={4}>
          <em>Esta aréa será exclusiva para Sócios em breve.</em>
        </Text>
        <Card>
          <AreaSocioMenu />
        </Card>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/entrar?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AreaSocio;
