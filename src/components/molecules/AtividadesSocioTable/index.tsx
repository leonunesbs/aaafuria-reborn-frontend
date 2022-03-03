import {
  Spinner,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { gql, useQuery } from '@apollo/client';

import { AtividadesSocioTableRow } from '@/components/atoms';
import { useCallback } from 'react';

export interface AtividadesSocioTableProps extends TableProps {
  categoria: string;
}

export type ProgramacaoData = {
  id: string;
  estado: string;
  descricao: string;
  modalidade: {
    nome: string;
    categoria: string;
  };
  dataHora: string;
  local: string;
  finalizado: boolean;
  competidoresMinimo: number;
  grupoWhatsappUrl: string;
  competidoresConfirmados: {
    edges: {
      node: {
        socio: {
          matricula: string;
        };
      };
    }[];
  };
};

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
}: AtividadesSocioTableProps) => {
  const { data, refetch } = useQuery(QUERY_PROGRAMACAO, {
    variables: {
      categoria: categoria,
    },
  });

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Table colorScheme="gray" {...rest}>
      <Thead>
        <Tr>
          <Th></Th>
          <Th></Th>
          <Th>Modalidade</Th>
          <Th>Categoria</Th>
          <Th>Data/hora</Th>
          <Th>Local</Th>
          <Th>Descrição</Th>
        </Tr>
      </Thead>
      <Tbody>
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
        {!data && (
          <Tr>
            <Td colSpan={7} textAlign="center">
              <Spinner color="green" />
            </Td>
          </Tr>
        )}
        {data?.allProgramacao.edges.length === 0 && (
          <Tr>
            <Td colSpan={7} textAlign="center">
              <em>Nenhuma atividade programada.</em>
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};
