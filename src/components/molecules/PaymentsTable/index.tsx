import {
  Badge,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  chakra,
} from '@chakra-ui/react';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';
import { Column, useSortBy, useTable } from 'react-table';
import {
  MdMoreHoriz,
  MdNavigateBefore,
  MdNavigateNext,
  MdRefresh,
} from 'react-icons/md';
import { gql, useQuery } from '@apollo/client';
import { useCallback, useContext, useMemo } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomIconButton } from '@/components/atoms';
import { useRouter } from 'next/router';

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
  shortView?: boolean;
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

function PaymentsTable({
  pageSize = 10,
  shortView = false,
}: PaymentsTableProps) {
  const router = useRouter();
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

  const handleNextPage = useCallback(async () => {
    if (data?.allPayments.hasNext) {
      await refetch({
        page: data.allPayments.page + 1,
      });
    }
  }, [data, refetch]);

  const handlePreviousPage = useCallback(async () => {
    if (data?.allPayments.hasPrev) {
      await refetch({
        page: data.allPayments.page - 1,
      });
    }
  }, [data, refetch]);

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
          Header: 'Member',
          accessor: 'user.member.name',
        },
        {
          Header: 'Descrição',
          accessor: 'description',
        },
        {
          Header: 'Valor',
          accessor: 'amount',
        },
        {
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
          Header: 'Ações',
          accessor: 'id',
          Cell: ({ value }: { value: string }) => {
            return (
              <HStack spacing={1}>
                <CustomIconButton
                  icon={<MdMoreHoriz size="20px" />}
                  aria-label="ver mais"
                  onClick={() => router.push(`/bank/payment/${value}`)}
                />
              </HStack>
            );
          },
        },
      ] as Column<Payment>[],
    [router],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: tableColumns, data: tableData }, useSortBy);

  return (
    <>
      <HStack my={6} justify="space-between">
        <Menu>
          <MenuButton as={Button} colorScheme="gray" size="xs">
            Filtro
          </MenuButton>
          <MenuList minWidth="240px">
            <MenuOptionGroup
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
      <TableContainer>
        <Table {...getTableProps()} size={'sm'}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                  >
                    {column.render('Header')}
                    <chakra.span pl="2">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <CustomIconButton
                            size="xs"
                            variant={'link'}
                            icon={<BsChevronCompactDown size="10px" />}
                            aria-label="sorted descending"
                          />
                        ) : (
                          <CustomIconButton
                            size="xs"
                            variant={'link'}
                            icon={<BsChevronCompactUp size="10px" />}
                            aria-label="sorted ascending"
                          />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                ))}
                <Th />
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()} key={cell.value}>
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
            {loading &&
              [...Array(5)].map((_, i) => (
                <Tr key={i}>
                  {tableColumns.map((column) => (
                    <Td key={column.id}>
                      <Skeleton height="40px" width="100%" rounded={'md'} />
                    </Td>
                  ))}
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <HStack w="full" justify={'center'} display={shortView ? 'none' : 'flex'}>
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
