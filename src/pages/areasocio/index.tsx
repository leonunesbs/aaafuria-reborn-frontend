import { PageHeading } from '@/components/atoms';
import { Card, AreaSocioMenu } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, useToast } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React, { useContext, useEffect } from 'react';

function AreaSocio() {
  const router = useRouter();
  const { isSocio, checkCredentials } = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    checkCredentials();

    if (isSocio === false) {
      toast({
        title: 'Que pena! Você não é sócio...',
        description: 'Mas nossa associação está aberta, Seja Sócio!',
        status: 'info',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/sejasocio');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSocio, toast]);

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
