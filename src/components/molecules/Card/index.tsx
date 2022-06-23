import { useColorModeValue } from '@chakra-ui/color-mode';
import { Box } from '@chakra-ui/react';
import React from 'react';
import { ICard } from './ICard';

export const Card = React.forwardRef<HTMLDivElement, ICard>(
  ({ children, variant, ...rest }, ref) => {
    const bg = useColorModeValue('white', 'whiteAlpha.50');
    const shadow = useColorModeValue('base', 'none');
    const greenBg = useColorModeValue('green.50', 'green.900');
    const redBg = useColorModeValue('red.50', 'red.700');
    const green = useColorModeValue('green.500', 'green.800');
    const red = useColorModeValue('red.600', 'red.200');
    if (variant === 'error') {
      return (
        <Box
          ref={ref}
          bg={redBg}
          py="8"
          px={{ base: '4', md: '10' }}
          shadow="base"
          rounded={{ base: 'md', sm: 'lg' }}
          borderWidth="1px"
          borderColor={red}
          {...rest}
        >
          {children}
        </Box>
      );
    }
    if (variant === 'success') {
      return (
        <Box
          ref={ref}
          bg={greenBg}
          py="8"
          px={{ base: '4', md: '10' }}
          shadow="base"
          rounded={{ base: 'md', sm: 'lg' }}
          borderWidth="1px"
          borderColor={green}
          {...rest}
        >
          {children}
        </Box>
      );
    }
    return (
      <Box
        ref={ref}
        bg={bg}
        py="8"
        px={{ base: '4', md: '10' }}
        shadow={shadow}
        rounded={{ base: 'md', sm: 'lg' }}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

Card.displayName = 'Card';
