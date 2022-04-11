import { PriceTag } from '@/components/atoms';
import { CustomButton } from '@/components/atoms/CustomButton';
import { Card } from '@/components/molecules';
import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { ProdutoType } from '@/pages/loja';
import { gql, useMutation } from '@apollo/client';
import { Flex, Heading, HStack, Stack } from '@chakra-ui/layout';
import {
  Button,
  FormControl,
  Image,
  Input,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import * as gtag from 'lib/gtag';
import { useRouter } from 'next/router';
import React, { useCallback, useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MdShoppingCart } from 'react-icons/md';

export type ProdutoCardProps = ProdutoType;

const ADD_TO_CART = gql`
  mutation addToCart(
    $productId: String!
    $quantidade: Int!
    $variacaoId: String
    $observacoes: String
  ) {
    adicionarAoCarrinho(
      productId: $productId
      quantidade: $quantidade
      variacaoId: $variacaoId
      observacoes: $observacoes
    ) {
      ok
    }
  }
`;

export const ProdutoCard = ({ node }: ProdutoCardProps) => {
  const router = useRouter();
  const { isAuthenticated, isSocio, token } = useContext(AuthContext);
  const { register, handleSubmit } = useForm<any>();
  const { green, bg } = useContext(ColorContext);

  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    context: {
      headers: {
        Authorization: `JWT ${token || ' '}`,
      },
    },
  });

  const [isLoading, setIsLoading] = React.useState(loading);
  const toast = useToast();

  // Handle submit
  const onSubmit: SubmitHandler<any> = useCallback(
    (formData) => {
      if (!isAuthenticated) {
        router.push(`entrar?after=${router.asPath}`);
      }
      const productId = node.id;
      const quantidade = 1;
      const variacaoId = formData.variacaoId;
      const observacoes = formData.observacoes;

      addToCart({
        variables: {
          productId: productId,
          quantidade: quantidade,
          variacaoId: variacaoId,
          observacoes: observacoes,
        },
      })
        .then(() => {
          setIsLoading(false);
          toast({
            title: `[${node.nome}] adicionado ao carrinho!`,
            description: (
              <CustomButton
                colorScheme={'green'}
                variant="solid"
                leftIcon={<MdShoppingCart size="25px" />}
                shadow="base"
                onClick={() => router.push('/carrinho')}
              >
                Ir para o carrinho
              </CustomButton>
            ),
            status: 'success',
            isClosable: true,
            duration: 2500,
            position: 'top-left',
          });
          gtag.event({
            action: 'add_to_cart',
            category: 'ecommerce',
            label: node.nome,
            value: 1,
            items: [
              {
                id: node.id,
                price: node.preco,
                name: node.nome,
                quantity: 1,
              },
            ],
          });
        })
        .catch((error) => {
          toast({
            title: error.message,
            status: 'info',
            isClosable: true,
            position: 'top-left',
          });
        });
    },
    [isAuthenticated, node.id, node.nome, node.preco, addToCart, router, toast],
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
            d="none"
            zIndex={1}
            bg={green}
            position="absolute"
            right={-16}
            top={10}
            width="250px"
            transform="rotate(45deg)"
            py={2}
            justifyContent="center"
            alignItems="center"
            shadow={'base'}
          >
            <Text
              fontSize={{ base: 'lg', lg: 'sm' }}
              textTransform="uppercase"
              fontWeight="bold"
              letterSpacing="wider"
              color={bg}
            >
              {((node.precoSocio / node.preco) * 100 - 100).toPrecision(2)}%
              OFF!
            </Text>
          </Flex>
        )}
        <Image
          w="full"
          objectFit="cover"
          src={node.imagem}
          mx="auto"
          alt={node.nome}
        />
        <Stack>
          <Stack p={4}>
            <Stack>
              <Heading as="h3" size="md">
                {node.nome}
              </Heading>
              <PriceTag
                as="h4"
                fontSize={'xl'}
                price={node.preco as number}
                discountedPrice={node.precoSocio}
              />
              <Text fontSize="md">{node.descricao}</Text>
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
                    {node?.variacoes.edges.map(({ node }) => (
                      <option key={node.id} value={node.id}>
                        {node.nome}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
              {node.hasObservacoes && (
                <FormControl>
                  <Input
                    required
                    focusBorderColor="green.500"
                    placeholder="Digite algo importante aqui..."
                    {...register('observacoes', {
                      required: true,
                      minLength: 3,
                      maxLength: 100,
                    })}
                  />
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
