import AreaSocioMenu from '@/components/AreaSocioMenu';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Box } from '@chakra-ui/react';
import { Card } from '@/components/Card';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

function AreaSocio() {
  const router = useRouter();
  const { checkCredentials, isSocio } = useContext(AuthContext);

  useEffect(() => {
    checkCredentials();

    if (isSocio === false) {
      alert('Você não tem permissão para acessar esta área.');
      router.push('/sejasocio');
    }
  }, [checkCredentials, isSocio, router]);

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
