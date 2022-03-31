import { Box, Text } from '@chakra-ui/react';

import { ColorContext } from '@/contexts/ColorContext';
import { CustomChakraNextLink } from '@/components/atoms';
import NextImage from 'next/image';
import { useContext } from 'react';

export const Footer = () => {
  const { green } = useContext(ColorContext);
  return (
    <Box bg="green.900" py="2" px={{ base: '4', lg: '8' }} position="relative">
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
        </CustomChakraNextLink>{' '}
      </Text>
      <CustomChakraNextLink
        href="https://www.instagram.com/leonunesbs/"
        chakraLinkProps={{
          ml: '1',
          _hover: {
            bgColor: 'gray.700',
          },
          position: 'absolute',
          bottom: '0',
          right: '4',
          p: '1',
        }}
      >
        <Text d={['none', 'initial']} as="em" textColor={'white'}>
          Dev&amp;Design{' '}
        </Text>
        <NextImage
          src={'/myLogo.png'}
          height="25px"
          width="25px"
          alt="myLogo"
        />
      </CustomChakraNextLink>
    </Box>
  );
};
