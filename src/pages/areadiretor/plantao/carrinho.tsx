import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { gql, useMutation, useQuery } from '@apollo/client';
import { MdArrowLeft, MdDelete, MdPayment } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Tfoot,
  Box,
  HStack,
} from '@chakra-ui/react';
import { PageHeading, CustomButtom } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';

const GET_PLANTAO_CARRINHO = gql`
  query getPlantaoCarrinho($matriculaSocio: String!) {
    plantaoCarrinho(matriculaSocio: $matriculaSocio) {
      id
      total
      user {
        socio {
          isSocio
        }
      }
      produtos {
        edges {
          node {
            id
            produto {
              nome
            }
            variacao {
              nome
            }
            quantidade
            preco
            precoSocio
          }
        }
      }
    }
  }
`;

const REMOVE_FROM_PLANTAO_CART = gql`
  mutation removeFromPlantaoCart(
    $produtoPedidoId: String!
    $matriculaSocio: String!
  ) {
    removerDoCarrinhoPlantao(
      produtoPedidoId: $produtoPedidoId
      matriculaSocio: $matriculaSocio
    ) {
      ok
    }
  }
`;

function Carrinho() {
  const router = useRouter();
  const { isStaff } = useContext(AuthContext);

  const { m: matriculaSocio } = router.query;
  const [carrinho, setCarrinho] = useState<any | null>(null);

  const { data } = useQuery(GET_PLANTAO_CARRINHO, {
    context: {
      headers: {
        authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
    variables: {
      matriculaSocio,
    },
    fetchPolicy: 'no-cache',
  });

  const [removeFromPlantaoCart] = useMutation(REMOVE_FROM_PLANTAO_CART, {
    context: {
      headers: {
        Authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
  });

  const handleCheckout = async () => {
    // const { data } = await stripeCheckoutPlantao({
    //   variables: {
    //     matriculaSocio,
    //   },
    // });
    router.push(`/areadiretor/plantao/pagamento?id=${carrinho.id}`);
  };

  useEffect(() => {
    if (data?.plantaoCarrinho) {
      setCarrinho(data.plantaoCarrinho);
    }
  }, [data]);

  useEffect(() => {
    isStaff === false && router.replace('/');
  }, [isStaff, router]);

  if (!carrinho) {
    return null;
  }
  if (!matriculaSocio || !carrinho.produtos) {
    return router.push('/areadiretor/plantao');
  }

  return (
    <Layout title="Carrinho Plantão">
      <Box maxW="6xl" mx="auto">
        <PageHeading>Carrinho plantão</PageHeading>
        <Card mt={10} overflowX="auto">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Produto</Th>
                <Th>Variação</Th>
                <Th maxW="sm">Quantidade</Th>
                <Th isNumeric>Valor unitário</Th>
                <Th isNumeric>Total unitário</Th>
                <Th>Ação</Th>
              </Tr>
            </Thead>
            <Tbody>
              {carrinho.produtos?.edges?.map(
                ({
                  node: {
                    id,
                    produto,
                    variacao,
                    quantidade,
                    preco,
                    precoSocio,
                  },
                }: {
                  node: {
                    id: string;
                    user: {
                      socio: {
                        isSocio: boolean;
                      };
                    };
                    produto: { nome: string; id: string };
                    variacao: { nome: string };
                    quantidade: number;
                    preco: any;
                    precoSocio: any;
                  };
                }) => (
                  <Tr key={`${produto.id}-${quantidade}`}>
                    <Td>{produto.nome}</Td>
                    <Td>{variacao?.nome}</Td>
                    <Td>{quantidade}</Td>
                    <Td isNumeric>
                      {carrinho.user.socio.isSocio
                        ? precoSocio.replace('.', ',')
                        : preco.replace('.', ',')}
                    </Td>
                    <Td isNumeric>
                      {carrinho.user.socio.isSocio
                        ? (precoSocio * quantidade).toFixed(2).replace('.', ',')
                        : (preco * quantidade).toFixed(2).replace('.', ',')}
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="remover"
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        icon={<MdDelete size="25px" />}
                        onClick={() =>
                          removeFromPlantaoCart({
                            variables: { produtoPedidoId: id, matriculaSocio },
                          }).then(() => router.reload())
                        }
                      />
                    </Td>
                  </Tr>
                ),
              )}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th />
                <Th />
                <Th isNumeric>TOTAL</Th>
                <Th isNumeric>{carrinho.total.replace('.', ',')}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </Card>
        <HStack flexDir="row-reverse" mt={4}>
          <CustomButtom
            maxW="xs"
            size="lg"
            ml={4}
            leftIcon={<MdPayment size="20px" />}
            onClick={handleCheckout}
          >
            Pagamento
          </CustomButtom>
          <CustomButtom
            maxW="xs"
            size="lg"
            colorScheme="red"
            leftIcon={<MdArrowLeft size="25px" />}
            onClick={() => router.back()}
          >
            Voltar
          </CustomButtom>
        </HStack>
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

export default Carrinho;
