import { Button, ButtonProps, useColorModeValue } from '@chakra-ui/react';
import { forwardRef, ReactNode } from 'react';
import { FiExternalLink } from 'react-icons/fi';

export interface CustomButtomProps extends ButtonProps {
  children?: ReactNode;
  hasExternalIcon?: boolean;
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtomProps>(
  ({ children, hasExternalIcon, ...rest }, ref) => {
    const green = useColorModeValue('green.600', 'green.200');
    return (
      <Button
        ref={ref}
        colorScheme="green"
        variant="ghost"
        w="full"
        rightIcon={hasExternalIcon ? <FiExternalLink size="15px" /> : <></>}
        _focus={{
          outlineColor: green,
          outlineWidth: '0.5px',
        }}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

CustomButton.displayName = 'CustomButton';
