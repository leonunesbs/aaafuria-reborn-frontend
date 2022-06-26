import { Badge, HStack, Text } from '@chakra-ui/react';
import { CustomChakraNextLink, CustomIconButton } from '@/components/atoms';
import { MdMoreHoriz, MdRefresh } from 'react-icons/md';
import { gql, useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { Column } from 'react-table';
import { CustomTable } from '..';

const ALL_PAYMENTS = gql`
  query allPayments($page: Int = 1, $status: String) {
    allPayments(page: $page, status: $status, pageSize: 0) {
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PaymentsTableProps {}

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

function PaymentsTable({}: PaymentsTableProps) {
  const { token } = useContext(AuthContext);

  const { data, loading, refetch } = useQuery<PaymentsData>(ALL_PAYMENTS, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  const tableData: Payment[] = useMemo(() => {
    if (loading) {
      return [];
    }

    return data?.allPayments.objects || [];
  }, [data, loading]);

  const tableColumns: Column<Payment>[] = useMemo(
    () =>
      [
        {
          id: 'user',
          Header: 'Membro',
          accessor: 'user.member.name',
        },
        {
          id: 'description',
          Header: 'Descrição',
          accessor: 'description',
        },
        {
          id: 'amount',
          Header: 'Valor',
          accessor: 'amount',
        },
        {
          id: 'currency',
          Header: 'Moeda',
          accessor: 'currency',
        },
        {
          id: 'createdAt',
          Header: 'Criado em',
          accessor: 'createdAt',
          Cell: ({ value }: { value: string }) => {
            return (
              <Text as={'time'} dateTime={value}>
                {new Date(value).toLocaleString('pt-BR', {
                  timeStyle: 'short',
                  dateStyle: 'short',
                  timeZone: 'America/Sao_Paulo',
                })}
              </Text>
            );
          },
        },
        {
          id: 'status',
          Header: 'Status',
          accessor: 'status',
          Cell: ({ value }: { value: string }) => {
            return (
              <Text>
                <Badge
                  colorScheme={
                    value === 'PAGO'
                      ? 'green'
                      : value === 'PENDENTE'
                      ? 'yellow'
                      : 'gray'
                  }
                >
                  {value}
                </Badge>
              </Text>
            );
          },
        },
        {
          id: 'id',
          Header: 'Ações',
          accessor: 'id',
          Cell: ({ value }: { value: string }) => {
            return (
              <HStack spacing={1}>
                <CustomChakraNextLink href={`/bank/payment/${value}`}>
                  <CustomIconButton
                    variant={'link'}
                    icon={<MdMoreHoriz size="20px" />}
                    aria-label="ver mais"
                  />
                </CustomChakraNextLink>
              </HStack>
            );
          },
        },
      ] as Column<Payment>[],
    [],
  );

  return (
    <>
      <HStack justify="space-between">
        <HStack pr={1} w="full" justify={'flex-end'}>
          <CustomIconButton
            aria-label="refresh payments"
            icon={<MdRefresh size="20px" />}
            size="sm"
            onClick={() => refetch()}
            isLoading={loading}
          />
        </HStack>
      </HStack>
      <CustomTable loading={loading} data={tableData} columns={tableColumns} />
    </>
  );
}

export default PaymentsTable;
