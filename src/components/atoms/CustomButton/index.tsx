import { forwardRef, useContext } from 'react';

import { Button } from '@chakra-ui/react';
import { ColorContext } from '@/contexts/ColorContext';
import { FiExternalLink } from 'react-icons/fi';
import { ICustomButton } from './ICustomButton';

export const CustomButton = forwardRef<HTMLButtonElement, ICustomButton>(
  ({ children, hasExternalIcon, ...rest }, ref) => {
    const { green } = useContext(ColorContext);
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
