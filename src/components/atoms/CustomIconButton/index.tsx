import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface CustomIconButtonProps extends IconButtonProps {
  children?: ReactNode;
}

export const CustomIconButtom = ({
  children,
  ...rest
}: CustomIconButtonProps) => {
  return (
    <IconButton colorScheme="green" variant="ghost" {...rest}>
      {children}
    </IconButton>
  );
};
