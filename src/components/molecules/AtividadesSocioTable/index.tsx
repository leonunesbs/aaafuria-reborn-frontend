import { AtividadesSocioTableRow } from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { SimpleGrid, Skeleton } from '@chakra-ui/react';
import { useCallback } from 'react';
import { IAtividadeSocioTable, ProgramacaoData } from './IAtividadesSocioTable';

const QUERY_PROGRAMACAO = gql`
  query getProgramacao($categoria: String!) {
    allProgramacao(modalidade_Categoria: $categoria, orderBy: "data_hora") {
      edges {
        node {
          id
          estado
          descricao
          modalidade {
            nome
            categoria
          }
          dataHora
          competidoresMinimo
          grupoWhatsappUrl
          competidoresConfirmados {
            edges {
              node {
                socio {
                  matricula
                }
              }
            }
          }
          local
          finalizado
        }
      }
    }
  }
`;

export const AtividadesSocioTable = ({
  categoria,
  ...rest
}: IAtividadeSocioTable) => {
  const { data, refetch, loading } = useQuery(QUERY_PROGRAMACAO, {
    variables: {
      categoria: categoria,
    },
  });

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={{ base: '5', md: '6' }}
        {...rest}
      >
        {loading && (
          <>
            <Skeleton h={'210px'} rounded="md" w="100%" />
            <Skeleton h={'210px'} rounded="md" w="100%" />
            <Skeleton h={'210px'} rounded="md" w="100%" />
          </>
        )}
        {data?.allProgramacao.edges.map(
          ({ node }: { node: ProgramacaoData }) => {
            if (!node.finalizado && !loading) {
              return (
                <AtividadesSocioTableRow
                  key={node.id}
                  node={node}
                  handleRefetch={handleRefetch}
                />
              );
            }
          },
        )}
      </SimpleGrid>
    </>
  );
};
