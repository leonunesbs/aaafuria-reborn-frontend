import {
  Box,
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
import { gql, useMutation, useQuery } from '@apollo/client';

import { AuthContext } from '@/contexts/AuthContext';
import { CustomButton } from '..';
import { MdCheck } from 'react-icons/md';
import { useContext } from 'react';

const ALL_CARTS = gql`
  query AllCarts($page: Int, $pageSize: Int) {
    allCarts(page: $page, pageSize: $pageSize) {
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

function CartsTable({ pageSize }: CartsTableProps) {
  const toast = useToast();
  const { token } = useContext(AuthContext);
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

  return (
    <TableContainer>
      <Table>
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
                  leftIcon={<MdCheck size="20px" />}
                  isLoading={loading}
                  onClick={async () => {
                    await deliverCart({ variables: { cartId: cart.id } }).then(
                      () => {
                        toast({
                          title: 'Pedido entregue',
                          description: 'O pedido foi entregue com sucesso!',
                        });
                        refetch();
                      },
                    );
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
  );
}

export default CartsTable;
