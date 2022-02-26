import {
  Box,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import {
  Card,
  CartaoCreditoTabPanel,
  EspecieTabPanel,
  PixTabPanel,
} from '@/components/molecules';
import {
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { MdRefresh } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const GET_CARRINHO = gql`
  query getCarrinho($id: ID!) {
    carrinho(id: $id) {
      id
      user {
        socio {
          matricula
          nome
        }
      }
      total
      produtos {
        edges {
          node {
            id
            produto {
              nome
            }
            quantidade
            getPrice
          }
        }
      }
      status
    }
  }
`;

export type CarrinhoData = {
  carrinho: {
    id: string;
    user: {
      socio: {
        matricula: string;
        nome: string;
      };
    };
    total: any;
    produtos: {
      edges: {
        node: {
          id: string;
          produto: {
            nome: string;
          };
          quantidade: number;
          getPrice: number;
        };
      }[];
    };
    status: string;
  };
};

function Pagamento() {
  const { isStaff } = useContext(AuthContext);

  const router = useRouter();
  const { id = '' }: any = router.query;

  const { data, refetch, loading } = useQuery<CarrinhoData>(GET_CARRINHO, {
    variables: {
      id,
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (!id) {
      return;
    }
  }, [id]);

  useEffect(() => {
    isStaff === false && router.replace('/');
  }, [isStaff, router]);

  return (
    <Layout title="Pagamento plantão">
      <Box maxW="2xl" mx="auto">
        <PageHeading>Pagamento</PageHeading>
        <Card>
          <Text textAlign={'center'}>
            <b>Matrícula: </b> {data?.carrinho.user.socio.matricula}
          </Text>
          <Text textAlign={'center'}>
            <b>Total: </b> R$ {data?.carrinho.total}
          </Text>
          <HStack justify={'center'}>
            <Text textAlign={'center'}>
              <b>Status: </b>
              {data?.carrinho.status}
            </Text>
            <CustomIconButton
              aria-label="atualizar"
              icon={<MdRefresh size="20px" />}
              isLoading={loading}
              onClick={() => refetch()}
            />
          </HStack>

          <Tabs isLazy align="center" colorScheme="green" mt={6} isFitted>
            <TabList>
              <Tab>Espécie</Tab>
              <Tab>PIX</Tab>
              <Tab>Cartão de crédito</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <EspecieTabPanel
                  parentData={{
                    data,
                  }}
                />
              </TabPanel>
              <TabPanel>
                <PixTabPanel
                  parentData={{
                    data,
                  }}
                />
              </TabPanel>
              <TabPanel>
                <CartaoCreditoTabPanel checkoutId={data?.carrinho.id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
        <VoltarButton href={'/areadiretor/plantao'} />
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

export default Pagamento;
