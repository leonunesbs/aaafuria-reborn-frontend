import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/color-mode';

export const Card = (props: BoxProps) => {
  const bg = useColorModeValue('white', 'gray.800');
  return (
    <Box
      bg={bg}
      py="8"
      px={{ base: '4', md: '10' }}
      shadow="base"
      rounded={{ base: 'md', sm: 'lg' }}
      {...props}
    />
  );
};
