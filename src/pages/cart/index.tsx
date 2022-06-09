import {
  CustomButton,
  CustomIconButton,
  PageHeading,
  PaymentMethods,
  PriceTag,
  QuantityCartItemSelector,
} from '@/components/atoms';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Divider,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useCallback, useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MdArrowLeft, MdDelete } from 'react-icons/md';

import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { HiCash } from 'react-icons/hi';

const GET_CART = gql`
  query getCart {
    cart {
      user {
        member {
          hasActiveMembership
        }
      }
      total
      items {
        edges {
          node {
            id
            item {
              id
              refItem {
                id
                name
                image
              }
              name
              description
              image
              price
              staffPrice
              membershipPrice
            }
            quantity
          }
        }
      }
    }
  }
`;

const DELETE_FROM_CART = gql`
  mutation deleteFromCart($itemId: ID!) {
    deleteFromCart(itemId: $itemId) {
      ok
    }
  }
`;

const CHECKOUT_CART = gql`
  mutation checkoutCart($methodId: String!) {
    checkoutCart(methodId: $methodId) {
      ok
      checkoutUrl
    }
  }
`;

interface CartData {
  cart: {
    user: {
      member: {
        hasActiveMembership: boolean;
      };
    };
    total: number;
    items: {
      edges: {
        node: {
          id: string;
          item: {
            id: string;
            refItem: {
              id: string;
              name: string;
              image: string;
            };
            image: string;
            description: string;
            name: string;
            price: number;
            staffPrice: number;
            membershipPrice: number;
          };
          quantity: number;
        };
      }[];
    };
  };
}

type CheckoutForm = {
  method: string;
};

function Cart() {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const { data, refetch } = useQuery<CartData>(GET_CART, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const checkoutForm = useForm<CheckoutForm>();

  const [deleteFromCart] = useMutation(DELETE_FROM_CART, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const [checkoutCart, { loading }] = useMutation(CHECKOUT_CART, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const handleDeleteFromCart = useCallback(
    async (itemId: string) => {
      await deleteFromCart({
        variables: {
          itemId: itemId,
        },
      }).then(async ({ errors }) => {
        if (errors) {
          throw errors;
        }
        refetch();
      });
    },
    [deleteFromCart, refetch],
  );

  const onSubmit: SubmitHandler<CheckoutForm> = useCallback(
    async ({ method }) => {
      await checkoutCart({
        variables: {
          methodId: method,
        },
      })
        .then(async ({ data }) => {
          if (data && data.checkoutCart.ok) {
            const { checkoutUrl } = data.checkoutCart;
            router.push(checkoutUrl);
          }
        })
        .catch((error) => {
          throw error;
        });
    },
    [checkoutCart, router],
  );

  return (
    <Layout title="Carrinho">
      <Box maxW="8xl" mx="auto">
        <PageHeading>Meu carrinho</PageHeading>
        <Card mb={4}>
          {data?.cart && data?.cart.items.edges.length > 0 ? (
            <Stack
              direction={['column', 'column', 'row']}
              align={['initial', 'flex-start']}
              spacing={4}
            >
              <Stack spacing={2} w="full">
                {data?.cart?.items.edges.map(
                  ({ node: { id, item, quantity } }) => {
                    return (
                      <Stack
                        key={id}
                        w="full"
                        direction={['column', 'column', 'column', 'row']}
                        position="relative"
                        p={4}
                        rounded={'md'}
                      >
                        <Box position={'absolute'} right={4}>
                          <CustomIconButton
                            colorScheme={'gray'}
                            aria-label="eliminate-from-cart"
                            icon={<MdDelete />}
                            onClick={() => handleDeleteFromCart(item.id)}
                          />
                        </Box>
                        <HStack spacing={4} mb={4} w="full">
                          <Box width="150px">
                            <Image
                              src={
                                item.refItem ? item.refItem.image : item.image
                              }
                              alt={item.name}
                              rounded={'md'}
                              draggable={false}
                              objectFit="contain"
                            />
                          </Box>
                          <Box>
                            <Heading as="h2" fontSize={'sm'}>
                              {item.refItem
                                ? `${item.refItem.name.toUpperCase()} - ${item.name.toUpperCase()}`
                                : item.name.toUpperCase()}
                            </Heading>
                            <Text as="h3" fontSize={'xs'}>
                              {item.description}
                            </Text>
                          </Box>
                        </HStack>
                        <HStack w="full" justify={'space-between'} px={[0]}>
                          <QuantityCartItemSelector
                            itemId={item.id}
                            quantity={quantity}
                            refetch={refetch}
                          />
                          <PriceTag
                            price={item.price}
                            discountedPrice={item.membershipPrice}
                            staffPrice={item.staffPrice}
                            quantity={quantity}
                          />
                        </HStack>
                      </Stack>
                    );
                  },
                )}
              </Stack>

              <Card w="full" maxW="md">
                <Heading as="h3" fontSize="md">
                  RESUMO DO PEDIDO
                </Heading>
                <Divider mb={4} />
                <HStack
                  w="full"
                  justify={'space-between'}
                  fontSize={'lg'}
                  mb={10}
                >
                  <Text>Total</Text>
                  <Text>
                    R${data?.cart?.total.toString().replace('.', ',')}
                  </Text>
                </HStack>
                <form onSubmit={checkoutForm.handleSubmit(onSubmit)}>
                  <Stack spacing={4}>
                    <Controller
                      name="method"
                      control={checkoutForm.control}
                      rules={{ required: 'Matrícula obrigatória' }}
                      render={({ field }) => <PaymentMethods {...field} />}
                    />
                    <CustomButton
                      type="submit"
                      colorScheme="green"
                      variant="solid"
                      leftIcon={<HiCash size="20px" />}
                      isLoading={loading}
                    >
                      Pagar
                    </CustomButton>
                  </Stack>
                </form>
              </Card>
            </Stack>
          ) : (
            <Text textAlign={'center'}>O seu carrinho está vazio.</Text>
          )}
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

export default Cart;
