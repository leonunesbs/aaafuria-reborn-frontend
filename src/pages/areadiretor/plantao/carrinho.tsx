import {
  Box,
  HStack,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { CustomButton, PageHeading, VoltarButton } from '@/components/atoms';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MdDelete, MdPayment } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { CustomIconButton } from '@/components/atoms/CustomIconButton';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

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
              id
              nome
            }
            variacao {
              id
              nome
            }
            observacoes
            quantidade
            preco
            precoSocio
          }
        }
      }
    }
  }
`;

const ADD_TO_CART_PLANTAO = gql`
  mutation addToCartPlantao(
    $productId: String!
    $quantidade: Int!
    $matriculaSocio: String!
    $variacaoId: String
  ) {
    adicionarAoCarrinhoPlantao(
      productId: $productId
      quantidade: $quantidade
      matriculaSocio: $matriculaSocio
      variacaoId: $variacaoId
    ) {
      ok
    }
  }
`;

const REMOVE_FROM_PLANTAO_CART = gql`
  mutation removeFromPlantaoCart(
    $produtoPedidoId: String!
    $matriculaSocio: String!
    $remove: Boolean
  ) {
    removerDoCarrinhoPlantao(
      produtoPedidoId: $produtoPedidoId
      matriculaSocio: $matriculaSocio
      remove: $remove
    ) {
      ok
    }
  }
`;

function Carrinho() {
  const router = useRouter();
  const { isStaff } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const { m: matriculaSocio } = router.query;

  const { data, refetch } = useQuery(GET_PLANTAO_CARRINHO, {
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

  const [removeFromPlantaoCart, removeParams] = useMutation(
    REMOVE_FROM_PLANTAO_CART,
    {
      context: {
        headers: {
          Authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
        },
      },
    },
  );

  const [addToCartPlantao, addParams] = useMutation(ADD_TO_CART_PLANTAO, {
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
    router.push(
      `/areadiretor/plantao/pagamento?id=${data?.plantaoCarrinho.id}`,
    );
  };

  useEffect(() => {
    isStaff === false && router.replace('/');
  }, [isStaff, router]);

  useEffect(() => {
    addParams.loading || (removeParams.loading && setLoading(true));
  }, [addParams.loading, removeParams.loading]);

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
                <Th>Observações</Th>
                <Th maxW="sm">Quantidade</Th>
                <Th isNumeric>Valor unitário</Th>
                <Th isNumeric>Total unitário</Th>
                <Th>Ação</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.plantaoCarrinho?.produtos?.edges?.map(
                ({
                  node: {
                    id,
                    produto,
                    variacao,
                    observacoes,
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
                    variacao: { nome: string; id: string } | null;
                    observacoes: string;
                    quantidade: number;
                    preco: any;
                    precoSocio: any;
                  };
                }) => (
                  <Tr key={`${produto.id}-${quantidade}`}>
                    <Td>{produto.nome}</Td>
                    <Td>{variacao?.nome}</Td>
                    <Td>{observacoes}</Td>
                    <Td>
                      <HStack>
                        <CustomIconButton
                          isDisabled={loading}
                          aria-label="remove_from_cart"
                          icon={<FaMinus size="15px" />}
                          onClick={() => {
                            setLoading(true);
                            removeFromPlantaoCart({
                              variables: {
                                produtoPedidoId: id,
                                matriculaSocio,
                              },
                            }).then(() =>
                              refetch().then(() => setLoading(false)),
                            );
                          }}
                        />
                        {loading ? (
                          <Spinner color="green" size="sm" />
                        ) : (
                          <Text>{quantidade}</Text>
                        )}
                        <CustomIconButton
                          isDisabled={loading}
                          aria-label="add_to_cart"
                          icon={<FaPlus size="15px" />}
                          onClick={() => {
                            setLoading(true);
                            addToCartPlantao({
                              variables: {
                                matriculaSocio,
                                productId: produto.id,
                                quantidade: 1,
                                variacaoId: variacao?.id,
                              },
                            }).then(() => {
                              refetch().then(() => setLoading(false));
                            });
                          }}
                        />
                      </HStack>
                    </Td>
                    <Td isNumeric>
                      {data?.plantaoCarrinho.user.socio.isSocio
                        ? precoSocio.replace('.', ',')
                        : preco.replace('.', ',')}
                    </Td>
                    <Td isNumeric>
                      {data?.plantaoCarrinho.user.socio.isSocio
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
                        onClick={() => {
                          setLoading(true);
                          removeFromPlantaoCart({
                            variables: {
                              produtoPedidoId: id,
                              matriculaSocio,
                              remove: true,
                            },
                          }).then(() =>
                            refetch().then(() => setLoading(false)),
                          );
                        }}
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
                <Th isNumeric>
                  {data?.plantaoCarrinho.total.replace('.', ',')}
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </Card>
        <HStack flexDir="row-reverse" mt={4}>
          <CustomButton
            maxW="xs"
            size="lg"
            ml={4}
            leftIcon={<MdPayment size="20px" />}
            onClick={handleCheckout}
          >
            Pagamento
          </CustomButton>
          <VoltarButton href={`/areadiretor/plantao?m=${matriculaSocio}`} />
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
