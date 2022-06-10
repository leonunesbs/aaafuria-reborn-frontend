import { Box, Stack } from '@chakra-ui/react';
import {
  CommentCard,
  CreateComment,
  IssueInfoCard,
} from '@/components/molecules';
import { PageHeading, VoltarButton } from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/atoms/CustomButton';
import { GetServerSideProps } from 'next';
import { IIssueType } from '../IIssueType';
import { Layout } from '@/components/templates';
import { MdHelpCenter } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const GET_ISSUE = gql`
  query getIssue($id: ID!) {
    issue(id: $id) {
      id
      title
      status
      getStatusDisplay
      priority
      getPriorityDisplay
      description
      author {
        apelido
        matricula
      }
      createdAt
      updatedAt
      comments {
        edges {
          node {
            id
            author {
              apelido
            }
            description
            createdAt
          }
        }
      }
    }
  }
`;

export interface IssueQueryData {
  issue: IIssueType;
}

function Solicitacao() {
  const router = useRouter();

  const { isAuthenticated, user, token } = useContext(AuthContext);
  const { id = '0' } = router.query;

  const { data, refetch, loading } = useQuery<IssueQueryData>(GET_ISSUE, {
    variables: { id },
    context: {
      headers: {
        authorization: `JWT ${token || ' '}`,
      },
    },
  });

  useEffect(() => {
    refetch();
    if (!isAuthenticated) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [isAuthenticated, refetch, router]);

  return (
    <Layout title={data?.issue?.title ? data.issue.title : 'Solicitação'}>
      <Stack maxW="7xl" mx="auto" spacing={4}>
        <IssueInfoCard
          issue={data?.issue as IIssueType}
          loadingIssueQuery={loading}
          refetchIssueQuery={refetch}
        />
        {data?.issue?.comments.edges && data.issue.comments.edges.length > 0 && (
          <Box>
            <PageHeading as="h2" size={'md'}>
              Comentários
            </PageHeading>
            <Stack>
              {data?.issue.comments.edges.map((comment) => (
                <CommentCard key={comment.node.id} comment={comment} />
              ))}
            </Stack>
          </Box>
        )}
        <Stack>
          <CreateComment issueId={id as string} refetchIssue={refetch} />
          {user?.isStaff && (
            <CustomButton
              leftIcon={<MdHelpCenter size="25px" />}
              colorScheme={'yellow'}
              onClick={() => router.push('/ajuda/gerenciar-solicitacoes')}
            >
              Gerenciar solicitações
            </CustomButton>
          )}
          <VoltarButton href={'/ajuda/minhas-solicitacoes'} />
        </Stack>
      </Stack>
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

export default Solicitacao;
