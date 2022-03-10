import { Box, Text } from '@chakra-ui/react';

import { ColorContext } from '@/contexts/ColorContext';
import { CustomChakraNextLink } from '@/components/atoms';
import { useContext } from 'react';

export const Footer = () => {
  const { green } = useContext(ColorContext);
  return (
    <Box bg="green.900" py="2" px={{ base: '4', lg: '8' }}>
      <Text textAlign="center" color="gray.50" letterSpacing={2}>
        &copy; 2022 |{' '}
        <CustomChakraNextLink
          href="/"
          chakraLinkProps={{
            fontFamily: 'heading',
            _hover: {
              color: green,
            },
          }}
        >
          A.A.A. FÚRIA
        </CustomChakraNextLink>
      </Text>
    </Box>
  );
};
