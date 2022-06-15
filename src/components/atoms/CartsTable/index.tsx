import {
  Box,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { CustomButton, CustomIconButton } from '..';
import { MdCheck, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';

const ALL_CARTS = gql`
  query AllCarts($page: Int, $pageSize: Int) {
    allCarts(page: $page, pageSize: $pageSize) {
      page
      pages
      hasNext
      hasPrev
      objects {
        id
        user {
          member {
            nickname
            name
          }
        }
        items {
          edges {
            node {
              id
              item {
                name
                refItem {
                  name
                }
              }
              description
              quantity
            }
          }
        }
        delivered
        ordered
        createdAt
        updatedAt
      }
    }
  }
`;

const DELIVER_CART = gql`
  mutation DeliverCart($cartId: ID!) {
    deliverCart(cartId: $cartId) {
      ok
    }
  }
`;

type CartsData = {
  allCarts: {
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
    objects: {
      id: string;
      user: {
        member: {
          nickname: string;
          name: string;
        };
      };
      items: {
        edges: {
          node: {
            id: string;
            item: {
              name: string;
              refItem: {
                name: string;
              };
            };
            description: string;
            quantity: number;
          };
        }[];
      };
      delivered: boolean;
      ordered: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
  };
};

export interface CartsTableProps {
  pageSize?: number;
  shortView?: boolean;
}

function CartsTable({ pageSize, shortView }: CartsTableProps) {
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { data, refetch } = useQuery<CartsData>(ALL_CARTS, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
    variables: {
      page: 1,
      pageSize: pageSize || 5,
    },
  });
  const [deliverCart, { loading }] = useMutation(DELIVER_CART, {
    context: {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  });

  const handleNextPage = useCallback(async () => {
    if (data?.allCarts.hasNext) {
      await refetch({
        page: data.allCarts.page + 1,
      });
    }
  }, [data, refetch]);

  const handlePreviousPage = useCallback(async () => {
    if (data?.allCarts.hasPrev) {
      await refetch({
        page: data.allCarts.page - 1,
      });
    }
  }, [data, refetch]);

  return (
    <>
      <TableContainer>
        <Table size={'sm'} variant="striped">
          <Thead>
            <Tr>
              <Th>Membro</Th>
              <Th>Itens</Th>
              <Th>Pago</Th>
              <Th>Atualizado</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.allCarts?.objects?.map((cart) => (
              <Tr key={cart.id}>
                <Td>{cart.user.member.name}</Td>
                <Td>
                  {cart.items.edges.map((item) => (
                    <Box key={item.node.id}>
                      {item.node.item.refItem?.name ? (
                        <Text>
                          {item.node.quantity}x {item.node.item.refItem.name} (
                          {item.node.item.name})
                        </Text>
                      ) : (
                        <Text>
                          {item.node.quantity}x {item.node.item.name}
                        </Text>
                      )}
                      <Text>{item.node.description}</Text>
                    </Box>
                  ))}
                </Td>

                <Td>{cart.ordered ? 'Sim' : 'Não'}</Td>
                <Td>
                  {new Date(cart.updatedAt).toLocaleString('pt-BR', {
                    timeStyle: 'short',
                    dateStyle: 'short',
                    timeZone: 'America/Sao_Paulo',
                  })}
                </Td>
                <Td>
                  <CustomButton
                    variant={'link'}
                    size="sm"
                    leftIcon={<MdCheck size="15px" />}
                    isLoading={loading}
                    onClick={async () => {
                      await deliverCart({
                        variables: { cartId: cart.id },
                      }).then(() => {
                        toast({
                          title: 'Pedido entregue',
                          description: 'O pedido foi entregue com sucesso!',
                        });
                        refetch();
                      });
                    }}
                  >
                    Entregar
                  </CustomButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <HStack w="full" justify={'center'} display={shortView ? 'none' : 'flex'}>
        <CustomIconButton
          visibility={data?.allCarts?.hasPrev ? 'visible' : 'hidden'}
          aria-label="prev-page"
          icon={<MdNavigateBefore size="20px" />}
          onClick={handlePreviousPage}
          colorScheme="gray"
          isLoading={loading}
        />
        <Text fontFamily={'AACHENN'} textColor={green}>
          {data?.allCarts?.page} de {data?.allCarts?.pages}
        </Text>
        <CustomIconButton
          visibility={data?.allCarts?.hasNext ? 'visible' : 'hidden'}
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

export default CartsTable;
