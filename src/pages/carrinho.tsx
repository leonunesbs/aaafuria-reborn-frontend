import { PageHeading } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React, { useEffect } from 'react';
import { MdCreditCard, MdDelete, MdPayment, MdStore } from 'react-icons/md';

const GET_USER_CARRINHO = gql`
  query getUserCarrinho {
    userCarrinho {
      total
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

const STRIPE_CHECKOUT = gql`
  mutation stripeCheckout {
    stripeCheckout {
      ok
      carrinho {
        stripeCheckoutUrl
      }
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation removeFromCart($produtoPedidoId: String!) {
    removerDoCarrinho(produtoPedidoId: $produtoPedidoId) {
      ok
    }
  }
`;

function Carrinho() {
  const router = useRouter();
  const { data } = useQuery(GET_USER_CARRINHO, {
    context: {
      headers: {
        authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
    fetchPolicy: 'no-cache',
  });
  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    context: {
      headers: {
        Authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
  });
  const [stripeCheckout, { loading }] = useMutation(STRIPE_CHECKOUT, {
    context: {
      headers: {
        authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
  });

  const [isSocio] = React.useState(parseCookies()['aaafuriaIsSocio']);

  const handleStripeCheckout = async () => {
    const { data } = await stripeCheckout();
    router.push(data.stripeCheckout.carrinho.stripeCheckoutUrl);
  };

  useEffect(() => {
    const produtos = data?.userCarrinho?.produtos?.edges;
    if (produtos && produtos.length === 0) {
      router.push('/loja');
    }
  }, [data?.userCarrinho?.produtos?.edges, router]);

  return (
    <Layout title="Carrinho">
      <Box maxW="6xl" mx="auto">
        <PageHeading>Carrinho</PageHeading>
        <Card overflowX="auto">
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
              {data?.userCarrinho?.produtos?.edges?.map(
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
                    {isSocio === 'true' ? (
                      <>
                        <Td isNumeric>{precoSocio.replace('.', ',')}</Td>
                        <Td isNumeric>
                          {(precoSocio * quantidade)
                            .toFixed(2)
                            .replace('.', ',')}
                        </Td>
                      </>
                    ) : (
                      <>
                        <Td isNumeric>{preco.replace('.', ',')}</Td>
                        <Td isNumeric>
                          {(preco * quantidade).toFixed(2).replace('.', ',')}
                        </Td>
                      </>
                    )}
                    <Td>
                      <IconButton
                        aria-label="remover"
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        icon={<MdDelete size="25px" />}
                        onClick={() =>
                          removeFromCart({
                            variables: { produtoPedidoId: id },
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
                <Th isNumeric>{data?.userCarrinho?.total.replace('.', ',')}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </Card>
        <Stack flexDir="row-reverse" mt={4}>
          <Text>
            TOTAL:{' '}
            <Text as="span" fontWeight="bold" fontSize="lg">
              R${data?.userCarrinho?.total.replace('.', ',')}
            </Text>
          </Text>
        </Stack>
        <Popover placement="top">
          <HStack flexDir="row-reverse" mt={4}>
            <PopoverTrigger>
              <Button
                colorScheme="green"
                variant="ghost"
                size="lg"
                ml={4}
                leftIcon={<MdPayment size="20px" />}
                isLoading={loading}
              >
                Pagamento
              </Button>
            </PopoverTrigger>
            <Button
              variant="ghost"
              leftIcon={<MdStore size="20px" />}
              size="lg"
              colorScheme="yellow"
              onClick={() => router.push('/loja')}
            >
              Loja
            </Button>
          </HStack>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader>
                <Text fontWeight="bold">Pagar com:</Text>
              </PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Stack>
                  <Button
                    colorScheme="green"
                    leftIcon={<MdCreditCard size="25px" />}
                    onClick={handleStripeCheckout}
                  >
                    Cartão de crédito
                  </Button>
                  <Button
                    isDisabled
                    colorScheme="green"
                    variant="outline"
                    leftIcon={
                      <Image
                        boxSize="25px"
                        objectFit="cover"
                        src="/calango-verde.png"
                        alt="calangos"
                        mx="auto"
                      />
                    }
                  >
                    Calangos
                  </Button>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
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
