import { HStack, Text } from '@chakra-ui/react';

import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { IPriceTag } from './IPriceTag';
import { useContext } from 'react';

export const PriceTag = ({ price, discountedPrice, ...rest }: IPriceTag) => {
  const { isSocio } = useContext(AuthContext);
  const { green } = useContext(ColorContext);
  const priceText = `R$ ${price?.toString().replace('.', ',')}`;
  const discountedPriceText = `R$ ${discountedPrice
    ?.toString()
    .replace('.', ',')}`;

  return (
    <HStack {...rest}>
      {isSocio && discountedPrice ? (
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
