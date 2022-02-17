import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { forwardRef, ReactNode } from 'react';

export interface CustomIconButtonProps extends IconButtonProps {
  children?: ReactNode;
}

export const CustomIconButton = forwardRef<
  HTMLButtonElement,
  CustomIconButtonProps
>(({ children, ...rest }, ref) => {
  return (
    <IconButton ref={ref} colorScheme="green" variant="ghost" {...rest}>
      {children}
    </IconButton>
  );
});

CustomIconButton.displayName = 'CustomIconButton';
