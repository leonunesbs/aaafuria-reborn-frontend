import {
  Button,
  FormControl,
  HStack,
  Heading,
  Image,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { CustomButton, CustomInput } from '@/components/atoms';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useContext, useState } from 'react';

import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { MdShoppingCart } from 'react-icons/md';
import { ProdutoType } from '../../organisms/LojaPlantao';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const ADD_TO_CART_PLANTAO = gql`
  mutation addToCartPlantao(
    $productId: String!
    $quantidade: Int!
    $matriculaSocio: String!
    $variacaoId: String
    $observacoes: String
  ) {
    adicionarAoCarrinhoPlantao(
      productId: $productId
      quantidade: $quantidade
      matriculaSocio: $matriculaSocio
      variacaoId: $variacaoId
      observacoes: $observacoes
    ) {
      ok
    }
  }
`;

export interface ProdutoPlantaoCardProps extends ProdutoType {
  matriculaSocio: string;
}

export const ProdutoPlantaoCard = ({
  node,
  matriculaSocio,
}: ProdutoPlantaoCardProps) => {
  const router = useRouter();
  const { green } = useContext(ColorContext);
  const { register, handleSubmit, control } = useForm<any>();
  const [addToCartPlantao, { loading }] = useMutation(ADD_TO_CART_PLANTAO, {
    context: {
      headers: {
        Authorization: `JWT ${parseCookies()['aaafuriaToken']}`,
      },
    },
  });

  const [isLoading, setIsLoading] = useState(loading);
  const toast = useToast();

  const onSubmit: SubmitHandler<any> = useCallback(
    (formData: { variacaoId: any; observacoes: any }) => {
      const productId = node.id;
      const quantidade = 1;
      const variacaoId = formData.variacaoId;
      const observacoes = formData.observacoes;

      addToCartPlantao({
        variables: {
          matriculaSocio,
          productId: productId,
          quantidade: quantidade,
          variacaoId: variacaoId,
          observacoes: `${observacoes}`,
        },
      }).then(() => {
        setIsLoading(false);
        toast({
          title: `[${node.nome}] adicionado ao carrinho!`,
          description: (
            <CustomButton
              colorScheme={'green'}
              variant="solid"
              leftIcon={<MdShoppingCart size="25px" />}
              shadow="base"
              onClick={() =>
                router.push(`/areadiretor/plantao/carrinho?m=${matriculaSocio}`)
              }
            >
              Ir para o carrinho
            </CustomButton>
          ),
          status: 'success',
          position: 'top-left',
          duration: 5000,
          isClosable: true,
        });
      });
    },
    [node, addToCartPlantao, matriculaSocio, toast, router],
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
          src={node.imagem}
          mx="auto"
          alt={node.nome}
        />
        <Stack>
          <Stack py="8" px={{ base: '4', md: '10' }}>
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
                    focusBorderColor={green}
                    placeholder="Selecione uma opção"
                    {...register('variacaoId')}
                  >
                    {node?.variacoes.edges.map(
                      ({ node }) =>
                        node.estoque > 0 && (
                          <option key={node.id} value={node.id}>
                            {node.nome}
                          </option>
                        ),
                    )}
                  </Select>
                </FormControl>
              )}
              {node.hasObservacoes && (
                <FormControl>
                  <Controller
                    name="observacoes"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <CustomInput
                        isRequired
                        placeholder="Observações"
                        {...field}
                      />
                    )}
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
          >
            Adicionar ao carrinho
          </Button>
        </Stack>
      </Card>
    </form>
  );
};
