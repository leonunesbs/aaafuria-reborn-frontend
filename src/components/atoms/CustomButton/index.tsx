import { forwardRef, useContext } from 'react';

import { ColorContext } from '@/contexts/ColorContext';
import { Button } from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { ICustomButton } from './ICustomButton';

export const CustomButton = forwardRef<HTMLButtonElement, ICustomButton>(
  ({ children, hasExternalIcon, ...rest }, ref) => {
    const { green } = useContext(ColorContext);
    return (
      <Button
        ref={ref}
        colorScheme="green"
        variant="outline"
        w="full"
        rightIcon={hasExternalIcon ? <FiExternalLink size="15px" /> : undefined}
        p={4}
        rounded="full"
        _focus={{
          outlineColor: green,
          outlineWidth: 'thin',
        }}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

CustomButton.displayName = 'CustomButton';
