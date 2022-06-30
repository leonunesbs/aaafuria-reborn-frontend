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
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { PageHeading } from '@/components/atoms';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

function AreaDiretor() {
  const router = useRouter();
  const { panel } = router.query;
  const toast = useToast();
  const { user } = useContext(AuthContext);

  const tabIndex = () => {
    switch (panel) {
      case 'members':
        return 0;
      case 'activities':
        return 1;
      case 'carts':
        return 2;
      case 'finances':
        return 3;
      default:
        return 0;
    }
  };

  const [index] = useState(tabIndex);

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
      <Tabs
        variant="solid-rounded"
        colorScheme="green"
        size={'sm'}
        defaultIndex={index}
      >
        <TabList fontFamily={'AACHENN'} overflow="auto" py={4}>
          <Tab
            onClick={() =>
              router.push('/areadiretor?panel=members', undefined, {
                scroll: false,
              })
            }
          >
            MEMBROS
          </Tab>
          <Tab
            onClick={() =>
              router.push('/areadiretor?panel=activities', undefined, {
                scroll: false,
              })
            }
          >
            ATIVIDADES
          </Tab>
          <Tab
            onClick={() =>
              router.push('/areadiretor?panel=carts', undefined, {
                scroll: false,
              })
            }
          >
            PEDIDOS
          </Tab>
          <Tab
            onClick={() =>
              router.push('/areadiretor?panel=finances', undefined, {
                scroll: false,
              })
            }
          >
            FINANCEIRO
          </Tab>
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
