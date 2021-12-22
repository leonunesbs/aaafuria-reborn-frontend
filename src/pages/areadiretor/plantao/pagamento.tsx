import { Card } from '@/components/Card';
import CustomButtom from '@/components/CustomButtom';
import CustomChakraNextLink from '@/components/CustomChakraNextLink';
import Layout from '@/components/Layout';
import { CartaoCreditoTabPanelContent } from '@/components/pagamento/CartaoCreditoTabPanelContent';
import { EspecieTabPanelContent } from '@/components/pagamento/EspecieTabPanel';
import { PixTabPanelContent } from '@/components/pagamento/PIXTabPanelContent';
import PageHeading from '@/components/PageHeading';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useQuery } from '@apollo/client';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useContext, useEffect } from 'react';
import { MdArrowLeft } from 'react-icons/md';

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
                <EspecieTabPanelContent
                  parentData={{
                    data,
                  }}
                />
              </TabPanel>
              <TabPanel>
                <PixTabPanelContent
                  parentData={{
                    data,
                  }}
                />
              </TabPanel>
              <TabPanel>
                <CartaoCreditoTabPanelContent checkoutId={data?.carrinho.id} />
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
            Voltar ao plantão
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
