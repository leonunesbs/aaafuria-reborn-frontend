import React from 'react';
import { useColorModeValue } from '@chakra-ui/color-mode';
import { BoxProps, Box } from '@chakra-ui/layout';

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
