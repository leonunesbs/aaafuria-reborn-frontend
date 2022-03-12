import { Box, Button, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import {
  CustomChakraNextLink,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { ProdutoCard, SocialIcons } from '@/components/molecules';
import React, { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { GetStaticProps } from 'next';
import { Layout } from '@/components/templates';
import { MdShoppingCart } from 'react-icons/md';
import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
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

function Loja({ produtos }: { produtos: QueryData }) {
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
        <Stack mt={4} align="center">
          <CustomChakraNextLink href="/carrinho">
            <Button
              mt={4}
              colorScheme="yellow"
              variant="ghost"
              w="full"
              leftIcon={<MdShoppingCart size="25px" />}
            >
              Carrinho
            </Button>
          </CustomChakraNextLink>
          <VoltarButton href="/" />
        </Stack>

        <SocialIcons mt={[4, 8]} />
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
