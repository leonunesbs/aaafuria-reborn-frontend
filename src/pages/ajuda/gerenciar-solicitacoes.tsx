import { Badge, Box, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import {
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { FaEye } from 'react-icons/fa';
import { Layout } from '@/components/templates';
import { useContext } from 'react';

const GET_ISSUES = gql`
  query {
    allIssues {
      edges {
        node {
          id
          title
          author {
            apelido
          }
          status
          priority
          createdAt
        }
      }
    }
  }
`;

type IssueType = {
  id: string;
  title: string;
  author: {
    apelido: string;
  };
  status: string;
  priority: string;
  createdAt: string;
};

interface QueryData {
  allIssues: {
    edges: {
      node: IssueType;
    }[];
  };
}

function GerenciarSolicitacoes() {
  const { token } = useContext(AuthContext);
  const { data } = useQuery<QueryData>(GET_ISSUES, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });
  return (
    <Layout title="Gerenciar solicitações">
      <Box maxW="5xl" mx="auto">
        <PageHeading>Gerenciar solicitações</PageHeading>
        <Card overflowX="auto">
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Data</Th>
                <Th>Título</Th>
                <Th>Autor</Th>
                <Th>Status</Th>
                <Th>Prioridade</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.allIssues?.edges?.map(({ node }) => (
                <Tr key={node.id}>
                  <Th>
                    <CustomChakraNextLink
                      href={`/ajuda/solicitacao/${node.id}`}
                    >
                      <CustomIconButton
                        aria-label="view"
                        icon={<FaEye size="15px" />}
                      />
                    </CustomChakraNextLink>
                  </Th>
                  <Th>
                    {new Date(node.createdAt).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                      timeZone: 'America/Sao_Paulo',
                    })}
                  </Th>
                  <Th>{node.title}</Th>
                  <Th>{node.author.apelido}</Th>
                  <Th>
                    <Badge
                      colorScheme={
                        node.status === 'Open'
                          ? 'green'
                          : node.status === 'In Progress'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {node.status}
                    </Badge>
                  </Th>
                  <Th>
                    <Badge
                      colorScheme={
                        node.priority === 'LOW'
                          ? 'blue'
                          : node.priority === 'MEDIUM'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {node.priority}
                    </Badge>
                  </Th>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
        <VoltarButton href="/ajuda/minhas-solicitacoes" />
      </Box>
    </Layout>
  );
}

export default GerenciarSolicitacoes;
