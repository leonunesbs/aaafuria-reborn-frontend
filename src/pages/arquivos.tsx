import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  CustomChakraNextLink,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates';
import { parseCookies } from 'nookies';
import { useContext } from 'react';

type AllFilesProps = {
  allFiles: {
    id: string;
    title: string;
    postedAt: string;
    isHidden: boolean;
    viewers: {
      edges: {
        node: {
          matricula: string;
        };
      }[];
    };
  }[];
};

const GET_ALL_FILES = gql`
  query getAllFiles {
    allFiles {
      id
      title
      postedAt
      isHidden
      viewers {
        edges {
          node {
            matricula
          }
        }
      }
    }
  }
`;

function Arquivos() {
  const { token, matricula } = useContext(AuthContext);

  const { data } = useQuery<AllFilesProps>(GET_ALL_FILES, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const green = useColorModeValue('green.600', 'green.200');
  return (
    <Layout title="Arquivos">
      <Box maxW="5xl" mx="auto">
        <PageHeading>Arquivos</PageHeading>
        <Card overflowX="auto">
          <Table>
            <Thead>
              <Tr>
                <Th colSpan={5}>Título</Th>
                <Th>Data</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.allFiles.map(
                (file) =>
                  !file.isHidden && (
                    <Tr
                      key={file.id}
                      fontWeight={
                        file.viewers.edges.find(
                          (node) => node.node.matricula === matricula,
                        )
                          ? 'normal'
                          : 'extrabold'
                      }
                    >
                      <Td>
                        <CustomChakraNextLink
                          href={`/arquivo/${file.id}`}
                          chakraLinkProps={{
                            color: green,
                            textAlign: 'right',
                            mt: 4,
                            _hover: {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {file.title}
                        </CustomChakraNextLink>
                      </Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td>
                        {new Date(file.postedAt).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                          timeZone: 'America/Sao_Paulo',
                        })}
                      </Td>
                    </Tr>
                  ),
              )}
              {data?.allFiles.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    <em>Nenhum arquivo encontrado</em>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Card>
        <VoltarButton href="/" />
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

export default Arquivos;
