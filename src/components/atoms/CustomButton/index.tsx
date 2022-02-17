import { Button, ButtonProps } from '@chakra-ui/react';
import { forwardRef, ReactNode } from 'react';
import { FiExternalLink } from 'react-icons/fi';

export interface CustomButtomProps extends ButtonProps {
  children?: ReactNode;
  hasExternalIcon?: boolean;
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtomProps>(
  ({ children, hasExternalIcon, ...rest }, ref) => {
    return (
      <Button
        ref={ref}
        colorScheme="green"
        variant="ghost"
        w="full"
        rightIcon={hasExternalIcon ? <FiExternalLink size="15px" /> : <></>}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

CustomButton.displayName = 'CustomButton';
