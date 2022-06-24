import {
  ActivitiesDashboardCard,
  CartsDashboardCard,
  MembersDashboardCard,
  PaymentsDashboardCard,
} from '@/components/molecules';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
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
      <PageHeading>Área do Diretor</PageHeading>
      <Tabs variant="solid-rounded" colorScheme="green" isLazy size={'sm'}>
        <TabList fontFamily={'AACHENN'} overflow="auto" py={4}>
          <Tab>MEMBROS</Tab>
          <Tab>ATIVIDADES</Tab>
          <Tab>PEDIDOS</Tab>
          <Tab>FINANCEIRO</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <MembersDashboardCard />
          </TabPanel>
          <TabPanel px={0}>
            <ActivitiesDashboardCard />
          </TabPanel>
          <TabPanel px={0}>
            <CartsDashboardCard />
          </TabPanel>
          <TabPanel px={0}>
            <PaymentsDashboardCard />
          </TabPanel>
        </TabPanels>
      </Tabs>
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
