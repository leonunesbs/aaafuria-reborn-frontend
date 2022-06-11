import {
  Badge,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates/Layout';
import { MdMoreHoriz } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { useRouter } from 'next/router';

const MY_PAYMENTS = gql`
  query MyPayments {
    myPayments {
      edges {
        node {
          id
          amount
          currency
          description
          createdAt
          status
        }
      }
    }
  }
`;

type MyPaymentsData = {
  myPayments: {
    edges: {
      node: {
        id: string;
        amount: number;
        currency: string;
        description: string;
        createdAt: string;
        status: string;
      };
    }[];
  };
};

function MyPayments() {
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const { data } = useQuery<MyPaymentsData>(MY_PAYMENTS, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <Layout title="Meus pagamentos">
      <Box maxW="5xl" mx="auto">
        <PageHeading>Meus pagamentos</PageHeading>
        <Card>
          <TableContainer>
            <Table size={'sm'}>
              <Thead>
                <Tr>
                  <Th>Descrição</Th>
                  <Th>Valor</Th>
                  <Th>Criado em</Th>
                  <Th>Status</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {data?.myPayments?.edges?.map(({ node }) => (
                  <Tr key={node.id}>
                    <Td>{node.description}</Td>
                    <Td>
                      {node.amount} {node.currency}
                    </Td>
                    <Td>
                      <Text as={'time'} dateTime={node.createdAt}>
                        {new Date(node.createdAt).toLocaleString('pt-BR', {
                          timeStyle: 'short',
                          dateStyle: 'short',
                          timeZone: 'America/Sao_Paulo',
                        })}
                      </Text>
                    </Td>
                    <Td>
                      <Text>
                        <Badge
                          variant={'solid'}
                          colorScheme={
                            node.status === 'PAGO' ? 'green' : 'gray'
                          }
                        >
                          {node.status}
                        </Badge>
                      </Text>
                    </Td>
                    <Td>
                      <CustomIconButton
                        icon={<MdMoreHoriz size="20px" />}
                        aria-label="ver mais"
                        onClick={() => router.push(`/bank/payment/${node.id}`)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
        <VoltarButton href="/areamembro" />
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

export default MyPayments;
