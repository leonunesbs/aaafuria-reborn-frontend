import {
  Box,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  CustomButton,
  CustomChakraNextLink,
  PageHeading,
} from '@/components/atoms';
import { gql, useMutation, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { Layout } from '@/components/templates';
import { MdLink } from 'react-icons/md';
import { useContext } from 'react';
import { useRouter } from 'next/router';

const GET_PAYMENT = gql`
  query getPayment($id: ID) {
    payment(id: $id) {
      id
      user {
        member {
          name
          registration
          group
          hasActiveMembership
        }
      }
      amount
      currency
      method
      description
      status
      createdAt
      updatedAt
      paid
      expired
      attachments {
        edges {
          node {
            id
            title
            content
            file
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

const CONFIRM_PAYMENT = gql`
  mutation confirmPayment($paymentId: ID!, $description: String!) {
    confirmPayment(paymentId: $paymentId, description: $description) {
      ok
    }
  }
`;
const CANCEL_PAYMENT = gql`
  mutation cancelPayment($paymentId: ID!, $description: String!) {
    cancelPayment(paymentId: $paymentId, description: $description) {
      ok
    }
  }
`;

type PaymentData = {
  payment: {
    id: string;
    user: {
      member: {
        name: string;
        registration: string;
        group: string;
        hasActiveMembership: boolean;
      };
    };
    amount: number;
    currency: number;
    method: string;
    description: string;
    status: string;
    paid: boolean;
    expired: boolean;
    createdAt: string;
    updatedAt: string;
    attachments: {
      edges: {
        node: {
          id: string;
          title: string;
          content: string;
          file: string;
          createdAt: string;
          updatedAt: string;
        };
      }[];
    };
  };
};

function Payment() {
  const { token, user } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [cancelPayment, { loading: cancelPaymentLoading }] = useMutation(
    CANCEL_PAYMENT,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );
  const [confirmPayment, { loading: confirmPaymentLoading }] = useMutation(
    CONFIRM_PAYMENT,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );
  const { data, refetch } = useQuery<PaymentData>(GET_PAYMENT, {
    variables: {
      id: id as string,
    },
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  return (
    <Layout title={data?.payment.description as string}>
      <Box maxW="4xl" mx="auto">
        <PageHeading>Pagamento</PageHeading>
        <Card>
          <Stack spacing={10}>
            <Box>
              <Text>Detalhes do pagamento:</Text>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>
                      <Text>Identificador:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>{data?.payment.id}</Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Valor:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>
                        {data?.payment.amount}
                        {data?.payment.currency}
                      </Text>
                    </Td>
                  </Tr>

                  <Tr>
                    <Td>
                      <Text>Descrição:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>{data?.payment.description}</Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Método:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>{data?.payment.method}</Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Status:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>{data?.payment.status}</Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Criado em:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>
                        {new Date(
                          data?.payment.createdAt as string,
                        ).toLocaleString('pt-BR', {
                          timeStyle: 'short',
                          dateStyle: 'short',
                          timeZone: 'America/Sao_Paulo',
                        })}
                      </Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Atualizado em:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>
                        {new Date(
                          data?.payment.updatedAt as string,
                        ).toLocaleString('pt-BR', {
                          timeStyle: 'short',
                          dateStyle: 'short',
                          timeZone: 'America/Sao_Paulo',
                        })}
                      </Text>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
            <Box>
              <Text>Dados do cliente:</Text>
              <Table>
                <Tbody>
                  <Tr>
                    <Td>
                      <Text>Nome:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>{data?.payment.user.member.name}</Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Matrícula:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>{data?.payment.user.member.registration}</Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Turma:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>{data?.payment.user.member.group}</Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Text>Associação:</Text>
                    </Td>
                    <Td textAlign={'right'}>
                      <Text>
                        {data?.payment.user.member.hasActiveMembership}
                      </Text>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
            <Box>
              <Text>Anexos: </Text>
              <Table>
                <Thead>
                  <Tr>
                    <Th />
                    <Th />
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.payment.attachments.edges.map(({ node }) => (
                    <Tr key={node.id}>
                      <Td>
                        <Text>{node.title}</Text>
                      </Td>
                      <Td>
                        <Text>{node.content}</Text>
                      </Td>
                      <Td>
                        <CustomButton
                          onClick={() => window.open(node.file, '_blank')}
                          aria-label={node.title}
                          leftIcon={<MdLink size="20px" />}
                        >
                          Abrir
                        </CustomButton>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <Stack>
              <CustomChakraNextLink href={'/bank/my-payments'}>
                <CustomButton>Meus pagamentos</CustomButton>
              </CustomChakraNextLink>
            </Stack>
            {user?.isStaff && (
              <Stack>
                {!data?.payment.paid && !data?.payment.expired && (
                  <CustomButton
                    variant={'solid'}
                    isLoading={confirmPaymentLoading}
                    onClick={async () => {
                      await confirmPayment({
                        variables: {
                          paymentId: data?.payment.id,
                          description: 'Pagamento confirmado manualmente.',
                        },
                      }).then(({ errors }) => {
                        if (errors) {
                          return alert(errors[0].message);
                        }
                        refetch();
                      });
                    }}
                  >
                    Validar pagamento
                  </CustomButton>
                )}
                {!data?.payment.paid && !data?.payment.expired && (
                  <CustomButton
                    variant={'solid'}
                    colorScheme="red"
                    isLoading={cancelPaymentLoading}
                    onClick={async () => {
                      await cancelPayment({
                        variables: {
                          paymentId: data?.payment.id,
                          description: 'Pagamento cancelado manualmente.',
                        },
                      }).then(() => {
                        refetch();
                      });
                    }}
                  >
                    Invalidar pagamento
                  </CustomButton>
                )}
                <CustomChakraNextLink href={'/bank/payments'}>
                  <CustomButton colorScheme="yellow">
                    Gerenciar pagamentos
                  </CustomButton>
                </CustomChakraNextLink>
              </Stack>
            )}
          </Stack>
        </Card>
      </Box>
    </Layout>
  );
}

export default Payment;
