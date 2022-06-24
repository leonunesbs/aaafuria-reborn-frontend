import {
  Badge,
  HStack,
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
import {
  Column,
  FilterTypes,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import {
  CustomChakraNextLink,
  CustomIconButton,
  CustomInput,
} from '@/components/atoms';
import {
  MdMoreHoriz,
  MdNavigateBefore,
  MdNavigateNext,
  MdRefresh,
} from 'react-icons/md';
import { gql, useQuery } from '@apollo/client';
import { useContext, useMemo, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';

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

export interface PaymentsTableProps {
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

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Text>
      Buscar:{' '}
      <CustomInput
        size="sm"
        maxW="xs"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} pagamentos...`}
      />
    </Text>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: any) {
  const count = preFilteredRows.length;

  return (
    <CustomInput
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Buscar ${count} pagamentos...`}
    />
  );
}

function PaymentsTable({ shortView = false }: PaymentsTableProps) {
  const { green } = useContext(ColorContext);
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

  const filterTypes: FilterTypes<Payment> = useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id as any];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    [],
  );

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  );

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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // start Pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    // end Paginatio
    // start Filters
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    // end Filters

    state: { pageIndex },
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: {
        pageSize: 20,
      },
      defaultColumn,
      filterTypes,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
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
      <TableContainer>
        <Table {...getTableProps()} size={'sm'} variant="simple">
          <Thead>
            <Tr>
              <Th
                colSpan={visibleColumns.length}
                style={{
                  textAlign: 'left',
                }}
              >
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={state.globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </Th>
            </Tr>
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
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, i) => (
                    <Td {...cell.getCellProps()} key={i}>
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
            {loading &&
              [...Array(20)].map((_, i) => (
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
          visibility={canPreviousPage ? 'visible' : 'hidden'}
          aria-label="prev-page"
          icon={<MdNavigateBefore size="20px" />}
          onClick={previousPage}
          colorScheme="gray"
          isLoading={loading}
        />
        <Text fontFamily={'AACHENN'} textColor={green}>
          {pageIndex + 1} de {pageOptions.length}
        </Text>
        <CustomIconButton
          visibility={canNextPage ? 'visible' : 'hidden'}
          aria-label="next-page"
          icon={<MdNavigateNext size="20px" />}
          onClick={nextPage}
          colorScheme="gray"
          isLoading={loading}
        />
      </HStack>
    </>
  );
}

export default PaymentsTable;
