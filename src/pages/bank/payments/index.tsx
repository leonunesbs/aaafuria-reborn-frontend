import {
  Badge,
  Box,
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

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates/Layout';
import { MdMoreHoriz } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useContext } from 'react';

const ALL_PAYMENTS = gql`
  query allPayments {
    allPayments {
      edges {
        node {
          id
          user {
            member {
              name
            }
          }
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

type PaymentsData = {
  allPayments: {
    edges: {
      node: {
        id: string;
        user: {
          member: {
            name: string;
          };
        };
        amount: number;
        currency: string;
        description: string;
        createdAt: string;
        status: string;
      };
    }[];
  };
};

function Payments() {
  const { token } = useContext(AuthContext);
  const { data } = useQuery<PaymentsData>(ALL_PAYMENTS, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <Layout title="Gerenciar pagamentos">
      <Box maxW="5xl" mx="auto">
        <PageHeading>Gerenciar pagamentos</PageHeading>
        <Card overflowX="auto">
          <Table size={'sm'}>
            <Thead>
              <Tr>
                <Th>Membro</Th>
                <Th>Descrição</Th>
                <Th>Valor</Th>
                <Th>Criado em</Th>
                <Th>Status</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {data?.allPayments?.edges?.map(({ node }) => (
                <Tr key={node.id}>
                  <Td>{node.user.member.name}</Td>
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
                        colorScheme={node.status === 'PAGO' ? 'green' : 'gray'}
                      >
                        {node.status}
                      </Badge>
                    </Text>
                  </Td>
                  <Td>
                    <CustomChakraNextLink href={`/bank/payment/${node.id}`}>
                      <CustomIconButton
                        icon={<MdMoreHoriz size="20px" />}
                        aria-label="ver mais"
                      />
                    </CustomChakraNextLink>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
        <VoltarButton href="/areadiretor" />
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

export default Payments;
