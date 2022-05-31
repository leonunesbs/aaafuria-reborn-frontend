import { HStack, Text } from '@chakra-ui/react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { IPriceTag } from './IPriceTag';
import { useContext } from 'react';

export const PriceTag = ({
  price,
  discountedPrice,
  quantity = 1,
  ...rest
}: IPriceTag) => {
  const { user } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const subPrice = price * quantity;
  const subDiscountedPrice = discountedPrice && discountedPrice * quantity;
  const priceText = `R$ ${subPrice?.toFixed(2).toString().replace('.', ',')}`;
  const discountedPriceText = `R$ ${subDiscountedPrice
    ?.toFixed(2)
    .toString()
    .replace('.', ',')}`;

  return (
    <HStack {...rest}>
      {user?.member.hasActiveMembership && discountedPrice ? (
        <>
          <Text as="s" fontWeight={'light'}>
            {priceText}
          </Text>
          <Text fontWeight={'bold'} textColor={green}>
            {discountedPriceText}
          </Text>
        </>
      ) : (
        <Text>{priceText}</Text>
      )}
    </HStack>
  );
};
