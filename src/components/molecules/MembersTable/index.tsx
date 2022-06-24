import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
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
import { useContext, useMemo } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomIconButton } from '@/components/atoms';

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

    state: { pageIndex },
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: {
        pageSize: 20,
      },
    },
    useSortBy,
    usePagination,
  );
  return (
    <>
      <TableContainer>
        <Table {...getTableProps()} size={'sm'} variant="simple">
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
