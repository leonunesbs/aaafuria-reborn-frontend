import {
  Badge,
  Box,
  HStack,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import {
  CustomChakraNextLink,
  CustomIconButton,
  PageHeading,
  VoltarButton,
} from '@/components/atoms';
import { MdMoreHoriz, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { gql, useQuery } from '@apollo/client';
import { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Card } from '@/components/molecules';
import { ColorContext } from '@/contexts/ColorContext';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components/templates/Layout';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

const ALL_PAYMENTS = gql`
  query allPayments($page: Int = 1, $status: String) {
    allPayments(page: $page, status: $status) {
      page
      pages
      hasNext
      hasPrev
      objects {
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
        updatedAt
        status
      }
    }
  }
`;

type PaymentsData = {
  allPayments: {
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    objects: {
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
      updatedAt: string;
      status: string;
    }[];
  };
};

function Payments() {
  const toast = useToast();
  const router = useRouter();
  const { token, user } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { data, loading, refetch } = useQuery<PaymentsData>(ALL_PAYMENTS, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
    fetchPolicy: 'no-cache',
  });

  const handleNextPage = () => {
    if (data?.allPayments.hasNext) {
      refetch({
        page: data.allPayments.page + 1,
      });
    }
  };

  const handlePreviousPage = () => {
    if (data?.allPayments.hasPrev) {
      refetch({
        page: data.allPayments.page - 1,
      });
    }
  };

  useEffect(() => {
    if (user?.isStaff === false) {
      toast({
        title: 'Área restrita',
        description: 'Você não tem permissão para acessar esta área.',
        status: 'warning',
        duration: 2500,
        isClosable: true,
        position: 'top-left',
      });
      router.push('/');
    }
  }, [router, toast, user?.isStaff]);
  return (
    <Layout title="Gerenciar pagamentos">
      <Box maxW="8xl" mx="auto">
        <PageHeading>Gerenciar pagamentos</PageHeading>
        <HStack my={6}>
          <Text>Filtrar por:</Text>
          <HStack>
            <Select
              size={'sm'}
              rounded="md"
              defaultValue=""
              focusBorderColor={green}
              onChange={(e) => {
                refetch({
                  status: e.target.value,
                });
              }}
            >
              <option value="">Status</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="PAGO">Pagos</option>
              <option value="EXPIRADO">Expirados</option>
            </Select>
          </HStack>
        </HStack>
        <Card overflowX="auto">
          <Table size={'sm'}>
            <Thead>
              {data?.allPayments?.objects.length === 0 ? (
                <Tr>
                  <Td colSpan={6}>
                    <Text textAlign="center">Nenhum pagamento encontrado</Text>
                  </Td>
                </Tr>
              ) : (
                <Tr>
                  <Th>Membro</Th>
                  <Th>Descrição</Th>
                  <Th>Valor</Th>
                  <Th>Atualizado em</Th>
                  <Th>Status</Th>
                  <Th />
                </Tr>
              )}
            </Thead>
            <Tbody>
              {data?.allPayments?.objects?.map((node) => (
                <Tr key={node.id}>
                  <Td>{node.user.member.name}</Td>
                  <Td>{node.description}</Td>

                  <Td>
                    {node.amount} {node.currency}
                  </Td>

                  <Td>
                    <Text as={'time'} dateTime={node.updatedAt}>
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
                        colorScheme={
                          node.status === 'PAGO'
                            ? 'green'
                            : node.status === 'PENDENTE'
                            ? 'yellow'
                            : 'gray'
                        }
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
          <HStack w="full" justify={'center'}>
            {data?.allPayments?.hasPrev && (
              <CustomIconButton
                aria-label="prev-page"
                icon={<MdNavigateBefore size="20px" />}
                onClick={handlePreviousPage}
                colorScheme="gray"
                isLoading={loading}
              />
            )}
            <Text fontFamily={'AACHENN'} textColor={green}>
              {data?.allPayments?.page} de {data?.allPayments?.pages}
            </Text>
            {data?.allPayments?.hasNext && (
              <CustomIconButton
                aria-label="next-page"
                icon={<MdNavigateNext size="20px" />}
                onClick={handleNextPage}
                colorScheme="gray"
                isLoading={loading}
              />
            )}
          </HStack>
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
