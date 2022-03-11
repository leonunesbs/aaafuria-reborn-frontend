import {
  CustomChakraNextLink,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { CustomButton } from '@/components/atoms/CustomButton';
import {
  CommentCard,
  CreateComment,
  IssueInfoCard,
} from '@/components/molecules';
import { IssueProps } from '@/components/molecules/IssueInfoCard';
import { Layout } from '@/components/templates';
import { AuthContext } from '@/contexts/AuthContext';
import { gql, useQuery } from '@apollo/client';
import { Box, Stack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useContext, useEffect } from 'react';
import { AiFillSetting } from 'react-icons/ai';

const GET_ISSUE = gql`
  query getIssue($id: ID!) {
    issue(id: $id) {
      id
      status
      priority
      title
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
  issue: IssueProps;
}

function Solicitacao() {
  const router = useRouter();

  const { isAuthenticated, checkCredentials, token, isStaff } =
    useContext(AuthContext);
  const { id = '0' } = router.query;

  const { data, refetch, loading } = useQuery<IssueQueryData>(GET_ISSUE, {
    variables: { id },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  useEffect(() => {
    refetch();
    checkCredentials();
    if (!isAuthenticated) {
      router.push(`/entrar?after=${router.asPath}`);
    }
  }, [checkCredentials, isAuthenticated, refetch, router]);

  return (
    <Layout title={data?.issue.title || 'Solicitação'}>
      <Stack maxW="7xl" mx="auto" spacing={4}>
        <IssueInfoCard
          issue={data?.issue as IssueProps}
          loadingIssueQuery={loading}
          refetchIssueQuery={refetch}
        />
        {data?.issue.comments.edges && data.issue.comments.edges.length > 0 && (
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
          {isStaff && (
            <CustomChakraNextLink href={'/ajuda/gerenciar-solicitacoes'}>
              <CustomButton
                leftIcon={<AiFillSetting size="20px" />}
                colorScheme={'yellow'}
              >
                Gerenciar solicitações
              </CustomButton>
            </CustomChakraNextLink>
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
