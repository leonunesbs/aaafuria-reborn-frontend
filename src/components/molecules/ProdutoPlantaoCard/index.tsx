import { Card } from '@/components/molecules';
import { gql, useMutation, useQuery } from '@apollo/client';
import { MdShoppingCart } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { ProdutoType } from '../../organisms/LojaPlantao';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import {
  Button,
  FormControl,
  Heading,
  HStack,
  Select,
  Stack,
  useToast,
  Image,
  Text,
} from '@chakra-ui/react';

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

const GET_VARIATIONS = gql`
  query getProdutoVariacoes($productId: String!) {
    variacaoByProductId(id: $productId) {
      id
      nome
    }
  }
`;

interface ProdutoPlantaoCardProps extends ProdutoType {
  matriculaSocio: string;
}

export const ProdutoPlantaoCard = ({
  node,
  matriculaSocio,
}: ProdutoPlantaoCardProps) => {
  const { register, handleSubmit } = useForm<any>();
  const [addToCartPlantao, { loading }] = useMutation(ADD_TO_CART_PLANTAO, {
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

  const [isLoading, setIsLoading] = useState(loading);
  const toast = useToast();

  const onSubmit: SubmitHandler<any> = useCallback(
    (formData) => {
      const productId = node.id;
      const quantidade = 1;
      const variacaoId = formData.variacaoId;

      addToCartPlantao({
        variables: {
          matriculaSocio,
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
    [node, addToCartPlantao, matriculaSocio, toast],
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
                <Text>
                  R${' '}
                  {node.preco
                    .toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
                    .replace('.', ',')}
                </Text>
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
          >
            Adicionar ao carrinho
          </Button>
        </Stack>
      </Card>
    </form>
  );
};
