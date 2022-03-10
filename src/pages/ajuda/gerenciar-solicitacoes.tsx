import { Badge, Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import {
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { FaEye } from 'react-icons/fa';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

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
  const router = useRouter();
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
    refetch();
    checkCredentials();
    if (!isAuthenticated || !isStaff) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [checkCredentials, isAuthenticated, isStaff, refetch, router]);
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
                  <Td>
                    {new Date(node.createdAt).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                      timeZone: 'America/Sao_Paulo',
                    })}
                  </Td>
                  <Td>{node.title}</Td>
                  <Td>{node.author.apelido}</Td>
                  <Td>
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
                      {node.priority}
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
