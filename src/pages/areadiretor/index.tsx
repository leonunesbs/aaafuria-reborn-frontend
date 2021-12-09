import AreaDiretorMenu from '@/components/AreaDiretorMenu';
import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Box } from '@chakra-ui/react';
import { Card } from '@/components/Card';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

function AreaDiretor() {
  const router = useRouter();
  const { checkSocio } = useContext(AuthContext);
  const [isStaff] = React.useState(parseCookies()['aaafuriaIsStaff']);

  useEffect(() => {
    checkSocio();

    if (isStaff !== 'true') {
      alert('Você não tem permissão para acessar esta área.');
      router.push('/');
    }
  }, [checkSocio, isStaff, router]);

  return (
    <Layout title="Área do Diretor">
      <Box maxW="xl" mx="auto">
        <PageHeading>Área do Diretor</PageHeading>
        <Card>
          <AreaDiretorMenu />
        </Card>
      </Box>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaIsStaff']: isStaff } = parseCookies(ctx);

  if (isStaff === 'true') {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default AreaDiretor;
