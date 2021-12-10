import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';

export const Card = (props: BoxProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.700')}
      py="8"
      px={{ base: '4', md: '10' }}
      shadow="base"
      rounded={{ base: 'md', sm: 'lg' }}
      {...props}
    />
  );
};
