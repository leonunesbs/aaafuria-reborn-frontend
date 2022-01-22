import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';

export interface CardProps extends BoxProps {
  children: React.ReactNode;
  variant?: string;
}

export const Card = ({ children, variant, ...rest }: CardProps) => {
  const bg = useColorModeValue('white', 'gray.800');
  const greenBg = useColorModeValue('green.100', 'green.900');
  const redBg = useColorModeValue('red.50', 'red.700');
  const green = useColorModeValue('green.500', 'green.500');
  const red = useColorModeValue('red.600', 'red.200');
  if (variant === 'error') {
    return (
      <Box
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
      bg={bg}
      py="8"
      px={{ base: '4', md: '10' }}
      shadow="base"
      rounded={{ base: 'md', sm: 'lg' }}
      {...rest}
    >
      {children}
    </Box>
  );
};
