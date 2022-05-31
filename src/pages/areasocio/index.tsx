import { AreaSocioMenu, Card } from '@/components/molecules';
import { Box, useToast } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

function AreaSocio() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    if (user?.member.hasActiveMembership === false) {
      toast({
        title: 'Que pena! Você não é sócio...',
        description: 'Mas nossa associação está aberta, Seja Sócio!',
        status: 'info',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/#seja-socio');
    }
  }, [router, toast, user?.member.hasActiveMembership]);

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
