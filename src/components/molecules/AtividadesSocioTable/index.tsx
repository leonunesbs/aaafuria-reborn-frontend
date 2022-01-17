import { AtividadesSocioTableRow } from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { Table, TableProps, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AtividadesSocioTableProps extends TableProps {}

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

const QUERY_PROGRAMACAO_ESPORTE = gql`
  {
    allProgramacao(modalidade_Categoria: "Esporte", orderBy: "data_hora") {
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
const QUERY_PROGRAMACAO_BATERIA = gql`
  {
    allProgramacao(modalidade_Categoria: "Bateria", orderBy: "data_hora") {
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
  ...rest
}: AtividadesSocioTableProps) => {
  const programacao_esporte = useQuery(QUERY_PROGRAMACAO_ESPORTE, {
    fetchPolicy: 'no-cache',
  });
  const programacao_bateria = useQuery(QUERY_PROGRAMACAO_BATERIA, {
    fetchPolicy: 'no-cache',
  });

  // Variable that unifies the data from both queries
  let programacao = [];
  if (programacao_esporte.data) {
    programacao = programacao_esporte.data.allProgramacao.edges;
  }
  if (programacao_bateria.data) {
    programacao = programacao.concat(
      programacao_bateria.data.allProgramacao.edges,
    );
  }

  return (
    <Table colorScheme="gray" {...rest}>
      <Thead>
        <Tr>
          <Th></Th>
          <Th>Modalidade</Th>
          <Th>Categoria</Th>
          <Th>Data/hora</Th>
          <Th>Local</Th>
          <Th>Descrição</Th>
        </Tr>
      </Thead>
      <Tbody>
        {programacao.map(({ node }: { node: ProgramacaoData }) => {
          if (!node.finalizado) {
            return <AtividadesSocioTableRow key={node.id} node={node} />;
          }
        })}
        {programacao.length === 0 && (
          <Tr>
            <Td colSpan={6} textAlign="center">
              <em>Nenhuma atividade programada.</em>
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};
