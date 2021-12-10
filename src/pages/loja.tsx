import Layout from '@/components/Layout';
import NextLink from 'next/link';
import PageHeading from '@/components/PageHeading';
import React, { useContext, useEffect } from 'react';
import router from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useQuery } from '@apollo/client';
import { MdHome, MdShoppingCart } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { ProdutoCard } from '@/components/ProdutoCard';
import { Social } from '@/components/Social';
import {
  Box,
  Button,
  IconButton,
  SimpleGrid,
  Stack,
  Grid,
  GridItem,
  Link,
  chakra,
} from '@chakra-ui/react';

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
  const { checkCredentials } = useContext(AuthContext);
  const [isSocio, setIsSocio] = React.useState(false);

  const ChakraNextLink = chakra(NextLink);

  useEffect(() => {
    checkCredentials();

    if (parseCookies()['aaafuriaIsSocio'] === 'true') {
      setIsSocio(true);
    }
  }, [isSocio, checkCredentials]);

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
        <Stack mt={4} align="center">
          <ChakraNextLink passHref href="/carrinho">
            <Link _hover={{ textDecoration: 'none' }}>
              <Button
                mt={4}
                colorScheme="yellow"
                variant="ghost"
                w="full"
                leftIcon={<MdShoppingCart size="25px" />}
              >
                Carrinho
              </Button>
            </Link>
          </ChakraNextLink>
          <ChakraNextLink passHref href="/">
            <Link _hover={{ textDecoration: 'none' }}>
              <Button
                mt={4}
                colorScheme="red"
                variant="ghost"
                w="full"
                leftIcon={<MdHome size="25px" />}
              >
                Voltar ao início
              </Button>
            </Link>
          </ChakraNextLink>
        </Stack>

        <Social mt={[4, 8]} />
      </Box>
    </Layout>
  );
}

export default Loja;
