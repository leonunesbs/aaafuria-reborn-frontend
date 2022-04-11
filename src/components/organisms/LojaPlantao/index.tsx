import { ProdutoPlantaoCard } from '@/components/molecules';
import { gql, useQuery } from '@apollo/client';
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
          variacoes {
            edges {
              node {
                id
                nome
                estoque
              }
            }
          }
          hasObservacoes
          estoque
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
    variacoes: {
      edges: {
        node: {
          id: string;
          nome: string;
          estoque: number;
        };
      }[];
    };
    hasObservacoes: boolean;
    estoque: number;
  };
};

export interface LojaPlantaoProps {
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
      columns={{ base: 1, lg: 3 }}
      spacing={{ base: '8', lg: '2' }}
      maxW="7xl"
      mx="auto"
      justifyItems="center"
      alignItems="center"
    >
      {data?.allProduto?.edges?.map(({ node }: ProdutoType) => {
        return (
          node.estoque > 0 && (
            <ProdutoPlantaoCard
              key={node.id}
              node={node}
              matriculaSocio={matriculaSocio}
            />
          )
        );
      })}
    </SimpleGrid>
  );
};
