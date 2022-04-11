import {
  Box,
  Center,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  CustomButton,
  CustomChakraNextLink,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import React, { useContext, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

import { AiOutlineUnorderedList } from 'react-icons/ai';
import { AuthContext } from '@/contexts/AuthContext';
import { GetStaticProps } from 'next';
import { Layout } from '@/components/templates';
import { MdShoppingCart } from 'react-icons/md';
import { ProdutoCard } from '@/components/molecules';
import client from '@/services/apollo-client';
import { parseCookies } from 'nookies';

const PRODUTO_QUERY = gql`
  query getProdutos {
    allProduto(isHidden: false) {
      edges {
        node {
          id
          nome
          descricao
          preco
          precoSocio
          imagem
          hasVariations
          hasObservacoes
        }
      }
    }
  }
`;

interface QueryData {
  allProduto: {
    edges: ProdutoType[];
  };
}

export type ProdutoType = {
  node: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    precoSocio: number;
    imagem: string;
    hasVariations: boolean;
    hasObservacoes: boolean;
  };
};

function Loja() {
  const { data: produtos, loading } = useQuery<QueryData>(PRODUTO_QUERY);
  const { checkCredentials } = useContext(AuthContext);
  const [isSocio, setIsSocio] = React.useState(false);

  useEffect(() => {
    checkCredentials();

    if (parseCookies()['aaafuriaIsSocio'] === 'true') {
      setIsSocio(true);
    }
  }, [isSocio, checkCredentials]);

  return (
    <Layout title="Loja">
      <Box maxW="5xl" mx="auto">
        <PageHeading>Loja</PageHeading>
        {loading && (
          <Center>
            <Spinner color="green" mx={'auto'} />
          </Center>
        )}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: '8', lg: '2' }}
          maxW="7xl"
          mx="auto"
          justifyItems="center"
          alignItems="center"
        >
          {produtos?.allProduto?.edges?.map(({ node }) => {
            return <ProdutoCard key={node.id} node={node} />;
          })}
        </SimpleGrid>
        {produtos?.allProduto?.edges?.length === 0 && (
          <Text textAlign={'center'}>
            <em>Nenhum produto disponível para compra online no momento.</em>
          </Text>
        )}
        <Stack mt={10}>
          <CustomChakraNextLink href="/carrinho">
            <CustomButton
              colorScheme="gray"
              leftIcon={<MdShoppingCart size="25px" />}
            >
              Carrinho
            </CustomButton>
          </CustomChakraNextLink>
          <CustomChakraNextLink href="/loja/meus-pedidos">
            <CustomButton
              colorScheme="gray"
              leftIcon={<AiOutlineUnorderedList size="25px" />}
            >
              Meus pedidos
            </CustomButton>
          </CustomChakraNextLink>
          <VoltarButton href="/" />
        </Stack>
      </Box>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({}) => {
  return await client
    .query({
      query: PRODUTO_QUERY,
    })
    .then(({ data }) => {
      return {
        props: {
          produtos: data,
        },
        revalidate: 60,
      };
    });
};

export default Loja;
