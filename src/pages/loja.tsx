import Layout from '@/components/Layout';
import PageHeading from '@/components/PageHeading';
import { ProdutoCard } from '@/components/ProdutoCard';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  IconButton,
  SimpleGrid,
  Stack,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import router from 'next/router';
import { parseCookies } from 'nookies';
import React, { useContext, useEffect } from 'react';
import { MdHome, MdShoppingCart } from 'react-icons/md';

const PRODUTO_QUERY = gql`
  query getProdutos {
    allProduto {
      edges {
        node {
          id
          nome
          descricao
          preco
          precoSocio
          imagem
          hasVariations
        }
      }
    }
  }
`;

export type ProdutoType = {
  node: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    precoSocio: number;
    imagem: string;
    hasVariations: boolean;
  };
};

function Loja() {
  const { data } = useQuery(PRODUTO_QUERY);
  const { checkSocio } = useContext(AuthContext);
  const [isSocio, setIsSocio] = React.useState(false);

  useEffect(() => {
    checkSocio();

    if (parseCookies()['aaafuriaIsSocio'] === 'true') {
      setIsSocio(true);
    }
  }, [isSocio, checkSocio]);

  return (
    <Layout title="Loja">
      <Box maxW="5xl" mx="auto">
        <Grid
          mx="auto"
          templateColumns={{ base: 'repeat(3, 1fr)', lg: 'repeat(7, 1fr)' }}
        >
          <GridItem colSpan={{ lg: 2 }}></GridItem>
          <GridItem justify="flex-end" colSpan={{ lg: 3 }}>
            <PageHeading>Loja</PageHeading>
          </GridItem>
          <GridItem
            colSpan={{ lg: 2 }}
            d={{ base: 'flex', lg: 'inline' }}
            flexDir="column"
          >
            <IconButton
              aria-label="Carrinho"
              size="md"
              colorScheme="green"
              variant="outline"
              icon={<MdShoppingCart size="25px" />}
              alignSelf="flex-end"
              onClick={() => router.push('/carrinho')}
            />
          </GridItem>
        </Grid>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: '8', lg: '2' }}
          maxW="7xl"
          mx="auto"
          justifyItems="center"
          alignItems="center"
        >
          {data?.allProduto?.edges?.map(({ node }: ProdutoType) => {
            return <ProdutoCard key={node.id} node={node} />;
          })}
        </SimpleGrid>
        <Stack align="center" mt={4}>
          <Button
            mt={4}
            colorScheme="gray"
            w="100%"
            maxW="sm"
            onClick={() => router.push('/carrinho')}
            leftIcon={<MdShoppingCart size="25px" />}
          >
            Carrinho
          </Button>
          <Button
            mt={4}
            colorScheme="red"
            w="100%"
            maxW="sm"
            onClick={() => router.push('/')}
            leftIcon={<MdHome size="25px" />}
          >
            Voltar ao início
          </Button>
        </Stack>
      </Box>
    </Layout>
  );
}

export default Loja;
