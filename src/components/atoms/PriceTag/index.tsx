import { AuthContext } from '@/contexts/AuthContext';
import { ColorContext } from '@/contexts/ColorContext';
import { HStack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { IPriceTag } from './IPriceTag';

export const PriceTag = ({
  price,
  discountedPrice,
  quantity = 1,
  ...rest
}: IPriceTag) => {
  const { isSocio } = useContext(AuthContext);
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
