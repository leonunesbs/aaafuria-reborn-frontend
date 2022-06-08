import {
  Badge,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { CustomChakraNextLink, CustomIconButton } from '@/components/atoms';
import {
  MdMoreHoriz,
  MdNavigateBefore,
  MdNavigateNext,
  MdRefresh,
} from 'react-icons/md';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { useContext } from 'react';

const ALL_PAYMENTS = gql`
  query allPayments($page: Int = 1, $status: String, $pageSize: Int) {
    allPayments(page: $page, status: $status, pageSize: $pageSize) {
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

export interface PaymentsTableProps {
  pageSize?: number;
}

export type Payment = {
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
};

type PaymentsData = {
  allPayments: {
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    objects: Payment[];
  };
};

function PaymentsTable({ pageSize = 10 }: PaymentsTableProps) {
  const { green } = useContext(ColorContext);
  const { token } = useContext(AuthContext);

  const { data, loading, refetch } = useQuery<PaymentsData>(ALL_PAYMENTS, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
    variables: {
      pageSize: pageSize,
    },
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

  return (
    <>
      <HStack my={6} justify="space-between">
        <Menu>
          <MenuButton as={Button} colorScheme="gray" size="xs">
            Filtro
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuOptionGroup
              defaultValue={''}
              title="Status"
              type="radio"
              onChange={(value) => {
                refetch({
                  status: value,
                });
              }}
            >
              <MenuItemOption value="">Todos</MenuItemOption>
              <MenuItemOption value="PAGO">Pagos</MenuItemOption>
              <MenuItemOption value="PENDENTE">Pendentes</MenuItemOption>
              <MenuItemOption value="EXPIRADO">Expirados</MenuItemOption>
            </MenuOptionGroup>
            <MenuDivider />
          </MenuList>
        </Menu>
        <HStack pr={1}>
          <CustomIconButton
            aria-label="refresh payments"
            icon={<MdRefresh size="20px" />}
            size="sm"
            onClick={() => refetch()}
            isLoading={loading}
          />
        </HStack>
      </HStack>
      <Box overflowX={'auto'}>
        <Table size={'sm'}>
          <Thead>
            {data?.allPayments.objects.length === 0 ? (
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
                <Th>Criado em</Th>
                <Th>Status</Th>
                <Th />
              </Tr>
            )}
          </Thead>
          <Tbody>
            {data?.allPayments.objects.map((node) => (
              <Tr key={node.id}>
                <Td>{node.user.member.name}</Td>
                <Td maxW="32">{node.description}</Td>

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
      </Box>
      <HStack w="full" justify={'center'}>
        <CustomIconButton
          visibility={data?.allPayments?.hasPrev ? 'visible' : 'hidden'}
          aria-label="prev-page"
          icon={<MdNavigateBefore size="20px" />}
          onClick={handlePreviousPage}
          colorScheme="gray"
          isLoading={loading}
        />
        <Text fontFamily={'AACHENN'} textColor={green}>
          {data?.allPayments?.page} de {data?.allPayments?.pages}
        </Text>
        <CustomIconButton
          visibility={data?.allPayments?.hasNext ? 'visible' : 'hidden'}
          aria-label="next-page"
          icon={<MdNavigateNext size="20px" />}
          onClick={handleNextPage}
          colorScheme="gray"
          isLoading={loading}
        />
      </HStack>
    </>
  );
}

export default PaymentsTable;
