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
  HStack,
  Input,
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
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { useContext, useMemo, useState } from 'react';

import { ColorContext } from '@/contexts/ColorContext';
import { CustomIconButton } from '@/components/atoms';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  const { green } = useContext(ColorContext);
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Text>
      Buscar:{' '}
      <Input
        size="sm"
        maxW="xs"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} resultados...`}
        rounded="3xl"
        focusBorderColor={green}
      />
    </Text>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: any) {
  const { green } = useContext(ColorContext);
  const count = preFilteredRows.length;

  return (
    <Input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Buscar ${count} resultados...`}
      rounded="3xl"
      focusBorderColor={green}
    />
  );
}

export interface CustomTableProps {
  data: any[];
  columns: Column<any>[];
  loading: boolean;
}

function CustomTable({ data, columns, loading }: CustomTableProps) {
  const { green } = useContext(ColorContext);
  const filterTypes: FilterTypes<any> = useMemo(
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
      columns,
      data,
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
                {columns.map((column) => (
                  <Td key={column.id}>
                    <Skeleton height="40px" width="100%" rounded={'md'} />
                  </Td>
                ))}
              </Tr>
            ))}
        </Tbody>
      </Table>
      <HStack w="full" justify={'center'}>
        <CustomIconButton
          visibility={canPreviousPage ? 'visible' : 'hidden'}
          aria-label="prev-page"
          icon={<MdNavigateBefore size="20px" />}
          onClick={previousPage}
          colorScheme="gray"
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
        />
      </HStack>
    </TableContainer>
  );
}

export default CustomTable;
