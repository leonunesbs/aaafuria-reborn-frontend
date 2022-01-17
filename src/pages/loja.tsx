import { CustomChakraNextLink, PageHeading } from '@/components/atoms';
import { ProdutoCard, SocialIcons } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useQuery } from '@apollo/client';
import { Box, Button, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { parseCookies } from 'nookies';
import React, { useContext, useEffect } from 'react';
import { MdArrowLeft, MdShoppingCart } from 'react-icons/md';

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
          {data?.allProduto?.edges?.map(({ node }: ProdutoType) => {
            return <ProdutoCard key={node.id} node={node} />;
          })}
        </SimpleGrid>
        {data?.allProduto?.edges?.length === 0 && (
          <Text textAlign={'center'} colspa>
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
          <CustomChakraNextLink href="/">
            <Button
              mt={4}
              colorScheme="red"
              variant="ghost"
              w="full"
              leftIcon={<MdArrowLeft size="25px" />}
            >
              Voltar
            </Button>
          </CustomChakraNextLink>
        </Stack>

        <SocialIcons mt={[4, 8]} />
      </Box>
    </Layout>
  );
}

export default Loja;
