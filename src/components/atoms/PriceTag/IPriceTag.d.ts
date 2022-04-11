import { StackProps } from '@chakra-ui/react';

export interface IPriceTag extends StackProps {
  price: number;
  discountedPrice?: number | null;
  quantity?: number;
}
