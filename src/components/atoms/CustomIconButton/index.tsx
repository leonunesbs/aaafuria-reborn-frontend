import {
  IconButton,
  IconButtonProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { forwardRef, ReactNode } from 'react';

export interface CustomIconButtonProps extends IconButtonProps {
  children?: ReactNode;
}

export const CustomIconButton = forwardRef<
  HTMLButtonElement,
  CustomIconButtonProps
>(({ children, ...rest }, ref) => {
  const green = useColorModeValue('green.600', 'green.200');

  return (
    <IconButton
      ref={ref}
      colorScheme="green"
      variant="ghost"
      _focus={{
        outlineColor: green,
        outlineWidth: '0.5px',
      }}
      {...rest}
    >
      {children}
    </IconButton>
  );
});

CustomIconButton.displayName = 'CustomIconButton';
