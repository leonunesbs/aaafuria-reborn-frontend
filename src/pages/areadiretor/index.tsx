import { AreaDiretorMenu, Card } from '@/components/molecules';
import { Box, useToast } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

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
  }, [checkCredentials, isStaff, router, toast]);

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
