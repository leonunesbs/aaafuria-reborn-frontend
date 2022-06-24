import { HStack, Input, useNumberInput, useToast } from '@chakra-ui/react';
import { MdAdd, MdRemove } from 'react-icons/md';
import { gql, useMutation } from '@apollo/client';
import { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { CustomIconButton } from '..';

const ADD_TO_CART = gql`
  mutation addToCart($itemId: ID!, $quantity: Int!) {
    addToCart(itemId: $itemId, quantity: $quantity) {
      ok
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation removeFromCart($itemId: ID!, $quantity: Int!) {
    removeFromCart(itemId: $itemId, quantity: $quantity) {
      ok
    }
  }
`;

export interface QuantityCartItemSelectorProps {
  refetch: () => void;
  itemId: string;
  quantity: number;
}

function QuantityCartItemSelector({
  refetch,
  itemId,
  quantity,
}: QuantityCartItemSelectorProps) {
  const toast = useToast();
  const { token } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      value: quantity,
      min: 1,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const [addToCart, { loading: addToCartLoading }] = useMutation(ADD_TO_CART, {
    context: {
      headers: {
        authorization: `JWT ${token}`,
      },
    },
  });

  const [removeFromCart, { loading: removeFromCartLoading }] = useMutation(
    REMOVE_FROM_CART,
    {
      context: {
        headers: {
          authorization: `JWT ${token}`,
        },
      },
    },
  );

  const handleAddToCart = useCallback(
    async (itemId: string) => {
      await addToCart({
        variables: {
          itemId: itemId,
          quantity: 1,
        },
      })
        .then(() => {
          refetch();
        })
        .catch((error) => {
          toast({
            title: 'Erro',
            description: error.message,
            status: 'warning',
            duration: 2500,
            isClosable: true,
            position: 'top-left',
          });
        });
    },
    [addToCart, refetch, toast],
  );

  const handleRemoveFromCart = useCallback(
    async (itemId: string) => {
      await removeFromCart({
        variables: {
          itemId: itemId,
          quantity: 1,
        },
      }).then(async ({ errors }) => {
        if (errors) {
          throw errors;
        }
        refetch();
      });
    },
    [removeFromCart, refetch],
  );
  return (
    <HStack>
      <CustomIconButton
        {...dec}
        aria-label="remove_from_cart"
        icon={<MdRemove size="15px" />}
        onClick={() => handleRemoveFromCart(itemId)}
        isLoading={removeFromCartLoading}
      />
      <Input
        {...input}
        w="50px"
        textAlign={'center'}
        isReadOnly
        focusBorderColor={green}
        size="xs"
        value={quantity}
      />
      <CustomIconButton
        {...inc}
        aria-label="add_to_cart"
        icon={<MdAdd size="15px" />}
        onClick={() => handleAddToCart(itemId)}
        isLoading={addToCartLoading}
      />
    </HStack>
  );
}

export default QuantityCartItemSelector;
