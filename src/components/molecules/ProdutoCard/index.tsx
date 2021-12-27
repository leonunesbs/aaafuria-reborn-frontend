import React, { useCallback, useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { Flex, Heading, HStack, Stack } from '@chakra-ui/layout';
import { gql, useMutation, useQuery } from '@apollo/client';
import { MdShoppingCart } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { ProdutoType } from '@/pages/loja';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  FormControl,
  Button,
  Text,
  Image,
  useToast,
  Select,
} from '@chakra-ui/react';

type ProdutoCardProps = ProdutoType;

const ADD_TO_CART = gql`
  mutation addToCart(
    $productId: String!
    $quantidade: Int!
    $variacaoId: String
  ) {
    adicionarAoCarrinho(
      productId: $productId
      quantidade: $quantidade
      variacaoId: $variacaoId
    ) {
      ok
    }
  }
`;

const GET_VARIATIONS = gql`
  query getProdutoVariacoes($productId: String!) {
    variacaoByProductId(id: $productId) {
      id
      nome
    }
  }
`;

export const ProdutoCard = ({ node }: ProdutoCardProps) => {
  const { register, handleSubmit } = useForm<any>();
  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    context: {
      headers: {
        Authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
  });

  const { data } = useQuery(GET_VARIATIONS, {
    variables: {
      productId: node.id,
    },
  });

  const { checkCredentials, isAuthenticated, isSocio } =
    useContext(AuthContext);
  const [isLoading, setIsLoading] = React.useState(loading);
  const toast = useToast();

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Handle submit
  const onSubmit: SubmitHandler<any> = useCallback(
    (formData) => {
      const productId = node.id;
      const quantidade = 1;
      const variacaoId = formData.variacaoId;

      addToCart({
        variables: {
          productId: productId,
          quantidade: quantidade,
          variacaoId: variacaoId,
        },
      }).then(() => {
        setIsLoading(false);
        toast({
          title: `[${node.nome}] adicionado ao carrinho!`,
          status: 'success',
          isClosable: true,
          position: 'top-left',
        });
      });
    },
    [addToCart, setIsLoading, toast, node],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        key={node.id}
        position="relative"
        w="100%"
        overflow="hidden"
        px="0"
        py="0"
      >
        {isSocio && (
          <Flex
            zIndex={1}
            bg="green"
            position="absolute"
            left={-16}
            top={6}
            width="210px"
            transform="rotate(-45deg)"
            py={2}
            justifyContent="center"
            alignItems="center"
          >
            <Text
              fontSize={{ base: 'xs', lg: 'sm' }}
              textTransform="uppercase"
              fontWeight="bold"
              letterSpacing="wider"
              color="gray.100"
            >
              {((node.precoSocio / node.preco) * 100 - 100).toPrecision(2)}%
              OFF!
            </Text>
          </Flex>
        )}
        <Image
          w="full"
          objectFit="cover"
          src=" https://picsum.photos/350"
          mx="auto"
          alt="produto"
        />
        <Stack>
          <Stack p={4} h="130px">
            <Stack>
              <Heading as="h3" size="md">
                {node.nome}
              </Heading>
              <Heading as="h4" size="sm">
                <Text as={isSocio ? 's' : 'span'}>
                  R${' '}
                  {node.preco
                    .toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                    .replace('.', ',')}
                </Text>
                {isSocio && (
                  <Text
                    as="span"
                    fontSize="xl"
                    fontWeight="extrabold"
                    color="green.500"
                  >
                    {' '}
                    R${' '}
                    {node.precoSocio
                      .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })
                      .replace('.', ',')}
                  </Text>
                )}
              </Heading>
            </Stack>
            <HStack>
              {node.hasVariations && (
                <FormControl>
                  <Select
                    required
                    focusBorderColor="green.500"
                    placeholder="Selecione o tamanho"
                    {...register('variacaoId')}
                  >
                    {data?.variacaoByProductId.map((variacao: any) => (
                      <option key={variacao.id} value={variacao.id}>
                        {variacao.nome}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </HStack>
          </Stack>
          <Button
            type="submit"
            rounded="0"
            leftIcon={<MdShoppingCart size="20px" />}
            colorScheme="green"
            isLoading={isLoading}
            loadingText="Adicionando..."
            isDisabled={!isAuthenticated}
          >
            {isAuthenticated
              ? 'Adicionar ao carrinho'
              : 'Faça login para comprar'}
          </Button>
        </Stack>
      </Card>
    </form>
  );
};
