import { BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ICard extends BoxProps {
  children: ReactNode;
  variant?: string;
}
