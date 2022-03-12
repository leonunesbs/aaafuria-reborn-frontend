import {
  Badge,
  Box,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { FaEye } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { IIssueType } from './IIssueType';
import { Layout } from '@/components/templates';
import { MdCircle } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const GET_ISSUES = gql`
  query getIssues($status: String) {
    allIssues(status: $status) {
      edges {
        node {
          id
          title
          author {
            apelido
          }
          status
          getStatusDisplay
          priority
          getPriorityDisplay
          category
          getCategoryDisplay
          createdAt
        }
      }
    }
  }
`;

interface QueryData {
  allIssues: {
    edges: {
      node: IIssueType;
    }[];
  };
}

function GerenciarSolicitacoes() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('');
  const { token, isStaff, checkCredentials, isAuthenticated } =
    useContext(AuthContext);
  const { data, refetch } = useQuery<QueryData>(GET_ISSUES, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  useEffect(() => {
    if (statusFilter) {
      refetch({ status: statusFilter });
    }
  }, [refetch, statusFilter]);

  useEffect(() => {
    refetch();
    checkCredentials();
    if (isStaff === false) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [checkCredentials, isAuthenticated, isStaff, refetch, router]);
  return (
    <Layout title="Gerenciar solicitações">
      <Box maxW="7xl" mx="auto">
        <PageHeading>Gerenciar solicitações</PageHeading>
        <Card overflowX="auto">
          <HStack justify={'right'}>
            <CustomIconButton
              aria-label="open"
              icon={<MdCircle size="15px" />}
              isActive={statusFilter === 'OPEN'}
              onClick={() => setStatusFilter('OPEN')}
            />
            <CustomIconButton
              aria-label="in-progress"
              icon={<MdCircle size="15px" />}
              isActive={statusFilter === 'IN_PROGRESS'}
              colorScheme={'yellow'}
              onClick={() => setStatusFilter('IN_PROGRESS')}
            />
            <CustomIconButton
              aria-label="closed"
              icon={<MdCircle size="15px" />}
              isActive={statusFilter === 'CLOSED'}
              colorScheme={'red'}
              onClick={() => setStatusFilter('CLOSED')}
            />
          </HStack>
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th colSpan={4}>Título</Th>
                <Th>Categoria</Th>
                <Th>Autor</Th>
                <Th>Data da solicitação</Th>
                <Th>Prioridade</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.allIssues && data.allIssues.edges.length < 1 && (
                <Tr>
                  <Td colSpan={10}>
                    <Text textAlign="center">
                      <em>Nenhuma solicitação encontrada.</em>
                    </Text>
                  </Td>
                </Tr>
              )}
              {data?.allIssues?.edges?.map(({ node }) => (
                <Tr key={node.id}>
                  <Td>
                    <CustomChakraNextLink
                      href={`/ajuda/solicitacao/${node.id}`}
                    >
                      <CustomIconButton
                        aria-label="view"
                        icon={<FaEye size="15px" />}
                      />
                    </CustomChakraNextLink>
                  </Td>
                  <Td>{node.title}</Td>
                  <Td />
                  <Td />
                  <Td />
                  <Td>{node.category}</Td>
                  <Td>{node.author.apelido}</Td>
                  <Td>
                    {new Date(node.createdAt).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                      timeZone: 'America/Sao_Paulo',
                    })}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        node.priority === 'LOW'
                          ? 'blue'
                          : node.priority === 'MEDIUM'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {node.getPriorityDisplay}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        node.status === 'OPEN'
                          ? 'green'
                          : node.status === 'IN_PROGRESS'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {node.getStatusDisplay}
                    </Badge>
                  </Td>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['aaafuriaToken']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: `/entrar?after=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
};

export default GerenciarSolicitacoes;
