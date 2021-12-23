import AreaSocioMenu from '@/components/AreaSocioMenu';
import { Card } from '@/components/Card';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, useToast } from '@chakra-ui/react';
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

    if (isSocio === false) {
      toast({
        description: 'Você não tem permissão para acessar esta área.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/sejasocio');
    }
  }, [checkCredentials, isSocio, router, toast]);

  return (
    <Layout title="Área do Socio">
      <Box maxW="xl" mx="auto">
        <PageHeading>Área do sócio</PageHeading>
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
