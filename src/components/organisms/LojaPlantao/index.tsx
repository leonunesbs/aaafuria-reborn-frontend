import { gql, useQuery } from '@apollo/client';
import { ProdutoPlantaoCard } from '@/components/molecules';
import { SimpleGrid } from '@chakra-ui/react';

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

interface LojaPlantaoProps {
  matriculaSocio: string;
}

export const LojaPlantao = ({ matriculaSocio }: LojaPlantaoProps) => {
  const { data } = useQuery(PRODUTO_QUERY);

  if (!matriculaSocio) {
    return <></>;
  }

  return (
    <SimpleGrid
      mt={10}
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={{ base: '8', lg: '2' }}
      maxW="7xl"
      mx="auto"
      justifyItems="center"
      alignItems="center"
    >
      {data?.allProduto?.edges?.map(({ node }: ProdutoType) => {
        return (
          <ProdutoPlantaoCard
            key={node.id}
            node={node}
            matriculaSocio={matriculaSocio}
          />
        );
      })}
    </SimpleGrid>
  );
};
