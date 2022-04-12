import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  chakra,
  useToast,
} from '@chakra-ui/react';
import { MdArrowLeft, MdCreditCard, MdDelete, MdPayment } from 'react-icons/md';
import { PageHeading, PriceTag } from '@/components/atoms';
import React, { useContext, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomButton } from '@/components/atoms/CustomButton';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import NextImage from 'next/image';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const GET_USER_CARRINHO = gql`
  query getUserCarrinho {
    userCarrinho {
      total
      produtos {
        edges {
          node {
            id
            produto {
              id
              nome
              imagem
            }
            variacao {
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

interface UserCarrinhoData {
  userCarrinho: {
    total: number;
    produtos: {
      edges: {
        node: {
          id: string;
          produto: {
            id: string;
            nome: string;
            imagem: string;
          };
          variacao: {
            nome: string;
          };
          observacoes: string;
          quantidade: number;
          preco: number;
          precoSocio: number;
        };
      }[];
    };
  };
}
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
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { data, refetch } = useQuery<UserCarrinhoData>(GET_USER_CARRINHO, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
    fetchPolicy: 'no-cache',
  });
  const [removeFromCart] = useMutation(REMOVE_FROM_CART, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });
  const [stripeCheckout, { loading }] = useMutation(STRIPE_CHECKOUT, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const handleStripeCheckout = async () => {
    await stripeCheckout().then(({ data }) => {
      router.push(data.stripeCheckout.carrinho.stripeCheckoutUrl);
    });
  };

  useEffect(() => {
    const produtos = data?.userCarrinho?.produtos?.edges;
    if (produtos?.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Seu carrinho está vazio',
        status: 'warning',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/loja');
    }
  }, [data?.userCarrinho?.produtos?.edges, router, toast]);

  const ChakraNextImage = chakra(NextImage);
  return (
    <Layout title="Carrinho">
      <Box maxW="8xl" mx="auto">
        <PageHeading>Meu carrinho</PageHeading>
        <Card mb={4}>
          <Stack
            direction={['column', 'column', 'row']}
            align={['initial', 'initial', 'flex-start']}
            spacing={4}
          >
            <Stack spacing={2} w="full">
              {data?.userCarrinho?.produtos?.edges?.map(
                ({
                  node: {
                    id,
                    produto,
                    quantidade,
                    variacao,
                    observacoes,
                    preco,
                    precoSocio,
                  },
                }) => (
                  <Stack
                    key={id}
                    w="full"
                    direction={['column', 'column', 'row']}
                  >
                    <HStack spacing={4} mb={4} w="full">
                      <Box width="130px" height="130px" position="relative">
                        <ChakraNextImage
                          src={produto.imagem}
                          alt={produto.nome}
                          rounded={'md'}
                          layout="fill"
                          draggable={false}
                        />
                      </Box>
                      <Box>
                        <Heading as="h2" fontSize={'md'}>
                          {produto.nome}
                        </Heading>
                        <Text as="h3">{variacao?.nome}</Text>
                        <Text as="h3">
                          {observacoes && `Obs.: ${observacoes}`}
                        </Text>
                      </Box>
                    </HStack>
                    <HStack w="full" justify={'space-between'} px={[0, 10]}>
                      <CustomButton
                        display={['flex', 'flex', 'none']}
                        aria-label="remover"
                        colorScheme="red"
                        variant="ghost"
                        leftIcon={<MdDelete size="25px" />}
                        size="sm"
                        onClick={() =>
                          removeFromCart({
                            variables: { produtoPedidoId: id },
                          }).then(() => refetch())
                        }
                        w="default"
                      >
                        Remover
                      </CustomButton>
                      <HStack maxW="50px">
                        <Input
                          value={quantidade}
                          isReadOnly
                          focusBorderColor={green}
                        />
                      </HStack>
                      <PriceTag
                        price={preco}
                        discountedPrice={precoSocio}
                        quantity={quantidade}
                      />
                      <CustomButton
                        display={['none', 'none', 'flex']}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        leftIcon={<MdDelete size="25px" />}
                        onClick={() =>
                          removeFromCart({
                            variables: { produtoPedidoId: id },
                          }).then(() => refetch())
                        }
                        w="default"
                      >
                        Remover
                      </CustomButton>
                    </HStack>
                  </Stack>
                ),
              )}
            </Stack>

            <Card minW={{ md: 'xs' }}>
              <Heading as="h3" fontSize="lg">
                RESUMO DO PEDIDO
              </Heading>
              <Divider mb={4} />
              <HStack w="full" justify={'space-between'} fontSize={'lg'} mb={6}>
                <Text>Total</Text>
                <Text>
                  R${data?.userCarrinho?.total.toString().replace('.', ',')}
                </Text>
              </HStack>
              <Popover placement="top">
                <PopoverTrigger>
                  <CustomButton
                    colorScheme="green"
                    variant="solid"
                    leftIcon={<MdPayment size="20px" />}
                    isLoading={loading}
                  >
                    Pagamento
                  </CustomButton>
                </PopoverTrigger>
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
                            <NextImage
                              height="25px"
                              width="25px"
                              src={'/calango-verde.png'}
                              alt="calangos"
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
            </Card>
          </Stack>
        </Card>

        <CustomButton
          variant="ghost"
          leftIcon={<MdArrowLeft size="25px" />}
          size="lg"
          colorScheme="gray"
          onClick={() => router.push('/loja')}
        >
          Continuar comprando
        </CustomButton>
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
