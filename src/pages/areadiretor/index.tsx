import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, useToast } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

import { AreaDiretorMenu, Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';

function AreaDiretor() {
  const router = useRouter();
  const toast = useToast();
  const { checkCredentials, isStaff } = useContext(AuthContext);

  useEffect(() => {
    checkCredentials();

    if (isStaff === false) {
      toast({
        title: 'Restrito.',
        description: 'Você não tem permissão para acessar esta área.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkCredentials, isStaff, toast]);

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

export default AreaDiretor;
