import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CustomIconButtomProps extends IconButtonProps {
  children?: ReactNode;
}

export const CustomIconButton = ({
  children,
  ...rest
}: CustomIconButtomProps) => {
  return (
    <IconButton colorScheme="green" variant="ghost" {...rest}>
      {children}
    </IconButton>
  );
};
