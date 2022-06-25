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
import { CustomIconButton, CustomInput } from '@/components/atoms';
import {
  HStack,
  Icon,
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
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { gql, useQuery } from '@apollo/client';
import { useContext, useMemo, useState } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';

const ALL_MEMBERS = gql`
  query allMembers {
    allMembers {
      id
      registration
      name
      nickname
      group
      hasActiveMembership
      activeMembership {
        id
        membershipPlan {
          title
        }
      }
    }
  }
`;

type Member = {
  id: string;
  registration: string;
  name: string;
  nickname: string;
  group: string;
  hasActiveMembership: boolean;
  activeMembership: {
    id: string;
    membershipPlan: {
      title: string;
    };
  };
};

type MemberData = {
  allMembers: Member[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MembersTableProps {}

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
        placeholder={`${count} mebros...`}
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
      placeholder={`Buscar ${count} membros...`}
    />
  );
}

function MembersTable({}: MembersTableProps) {
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { data, loading } = useQuery<MemberData>(ALL_MEMBERS, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const tableData: Member[] = useMemo(() => {
    if (loading) {
      return [];
    }
    return data?.allMembers || [];
  }, [data, loading]);

  const filterTypes: FilterTypes<Member> = useMemo(
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

  const tableColumns: Column<Member>[] = useMemo(
    () =>
      [
        {
          id: 'registration',
          Header: 'Matrícula',
          accessor: 'registration',
        },
        {
          id: 'name',
          Header: 'Nome',
          accessor: 'name',
        },
        {
          id: 'group',
          Header: 'Turma',
          accessor: 'group',
        },
        {
          id: 'hasActiveMembership',
          Header: 'Sócio',
          accessor: 'hasActiveMembership',
          Cell: ({ value: isSocio }: { value: boolean }) => {
            return (
              <Icon
                as={isSocio ? HiCheckCircle : HiXCircle}
                color={isSocio ? green : 'red.500'}
                h={5}
                w={5}
              />
            );
          },
        },
        {
          id: 'activeMembership',
          Header: 'Plano',
          accessor: 'activeMembership.membershipPlan.title',
          Cell: ({ value }: { value: string }) => {
            return <>{value}</> || <>{'-'}</>;
          },
        },
      ] as Column<Member>[],
    [green],
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
    // end Pagination

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
          </Tbody>
        </Table>
      </TableContainer>
      <HStack w="full" justify={'center'}>
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

export default MembersTable;
