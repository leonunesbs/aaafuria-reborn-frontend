import {
  ActivitiesDashboardCard,
  CartsDashboardCard,
  MembersDashboardCard,
  PaymentsDashboardCard,
} from '@/components/molecules';
import { Box, Grid, GridItem, useToast } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

function AreaDiretor() {
  const router = useRouter();
  const toast = useToast();
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
    <Layout title="Área do Diretor">
      <Box maxW="7xl" mx="auto">
        <PageHeading>Área do Diretor</PageHeading>
        <Grid
          templateAreas={[
            `
            "members"
            "carts"
            "activities"
            "payments"
          `,
            `
            "members carts"
            "payments carts"
            "activities activities"
          `,
          ]}
          gridTemplateRows={['repeat(100%, 4)', 'repeat(100%, 3)']}
          gridTemplateColumns={['100%', '40% 60%']}
          gap="2"
        >
          <GridItem area={'members'}>
            <MembersDashboardCard />
          </GridItem>
          <GridItem area={'carts'}>
            <CartsDashboardCard />
          </GridItem>
          <GridItem area={'payments'}>
            <PaymentsDashboardCard />
          </GridItem>
          <GridItem area={'activities'}>
            <ActivitiesDashboardCard />
          </GridItem>
        </Grid>
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
