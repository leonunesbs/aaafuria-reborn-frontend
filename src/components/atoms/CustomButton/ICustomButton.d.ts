import { ButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ICustomButton extends ButtonProps {
  children?: ReactNode;
  hasExternalIcon?: boolean;
}
