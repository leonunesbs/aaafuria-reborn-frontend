import { Box, useToast } from '@chakra-ui/react';
import { Card, PaymentsTable } from '@/components/molecules';
import { PageHeading, VoltarButton } from '@/components/atoms';
import { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates/Layout';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

function Payments() {
  const toast = useToast();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.isStaff === false) {
      toast({
        title: 'Área restrita',
        description: 'Você não tem permissão para acessar esta área.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/');
    }
  }, [router, toast, user?.isStaff]);
  return (
    <Layout title="Gerenciar pagamentos">
      <Box maxW="8xl" mx="auto">
        <PageHeading>Gerenciar pagamentos</PageHeading>

        <Card>
          <Box overflowX="auto">
            <PaymentsTable />
          </Box>
        </Card>

        <VoltarButton href="/areadiretor" />
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
    props: {
      token,
    },
  };
};

export default Payments;
