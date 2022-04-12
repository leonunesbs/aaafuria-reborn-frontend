import { IAtividadeSocioTable, ProgramacaoData } from './IAtividadesSocioTable';
import { SimpleGrid, Spinner, Stack } from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';
import { useCallback, useContext } from 'react';

import { AtividadesSocioTableRow } from '@/components/atoms';
import { ColorContext } from '@/contexts/ColorContext';

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
  const { green } = useContext(ColorContext);
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
      {loading && (
        <Stack w="full" justify={'center'} align="center" my={4}>
          <Spinner color={green} />
        </Stack>
      )}
      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        gap={{ base: '5', md: '6' }}
        {...rest}
      >
        {data?.allProgramacao.edges.map(
          ({ node }: { node: ProgramacaoData }) => {
            if (!node.finalizado) {
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
