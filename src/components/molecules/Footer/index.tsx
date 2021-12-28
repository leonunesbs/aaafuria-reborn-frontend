import { Box, Text } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Box bg="green.900" py="2" px={{ base: '4', lg: '8' }}>
      <Text textAlign="center" color="gray.50">
        &copy; Copyright 2021 | <strong>A.A.A. Fúria</strong>
      </Text>
    </Box>
  );
};
