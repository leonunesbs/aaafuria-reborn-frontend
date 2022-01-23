import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { gql, useQuery } from '@apollo/client';
import { Layout } from '@/components/templates';
import { MdArrowLeft } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  PageHeading,
  CustomChakraNextLink,
  CustomButtom,
} from '@/components/atoms';
import {
  Card,
  EspecieTabPanel,
  PixTabPanel,
  CartaoCreditoTabPanel,
} from '@/components/molecules';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';

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
  };
};

function Pagamento() {
  const { isStaff } = useContext(AuthContext);

  const router = useRouter();
  const { id = '' }: any = router.query;

  const { data } = useQuery<CarrinhoData>(GET_CARRINHO, {
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
    <Layout>
      <Box maxW="2xl" mx="auto">
        <PageHeading>Pagamento</PageHeading>
        <Card>
          <Text textAlign={'center'}>
            <b>Matrícula: </b> {data?.carrinho.user.socio.matricula}
          </Text>
          <Text textAlign={'center'}>
            <b>Total: </b> R$ {data?.carrinho.total}
          </Text>

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
        <CustomChakraNextLink href={'/areadiretor/plantao'}>
          <CustomButtom
            leftIcon={<MdArrowLeft size="25px" />}
            colorScheme="red"
            mt={4}
          >
            Voltar
          </CustomButtom>
        </CustomChakraNextLink>
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
