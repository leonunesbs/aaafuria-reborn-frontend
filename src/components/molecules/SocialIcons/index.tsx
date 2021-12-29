import React from 'react';
import { Box, Divider, Heading, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { CustomChakraNextLink } from '@/components/atoms';
import { FaTiktok } from 'react-icons/fa';
import { IconButton } from '@chakra-ui/button';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
} from 'react-icons/ai';

export const SocialIcons = ({ ...rest }) => {
  const greenColor = useColorModeValue('green.600', 'green.200');
  return (
    <Box {...rest}>
      <Divider h="15px" mb={4} />
      <Heading size="sm" fontWeight="light" textAlign="center">
        <i>
          Siga a{' '}
          <Text as="span" color={greenColor} fontWeight="bold">
            Fúria
          </Text>
          :
        </i>
      </Heading>
      <HStack justify="center" spacing={4} p={2}>
        <CustomChakraNextLink href="https://facebook.com/aaafuria">
          <IconButton
            aria-label="Facebook"
            colorScheme="green"
            variant="ghost"
            icon={<AiFillFacebook size="35px" />}
          />
        </CustomChakraNextLink>
        <CustomChakraNextLink href="https://instagram.com/aaafuria">
          <IconButton
            aria-label="Instagram"
            colorScheme="green"
            variant="ghost"
            icon={<AiFillInstagram size="35px" />}
          />
        </CustomChakraNextLink>
        <CustomChakraNextLink href="https://twitter.com/Aaafuria">
          <IconButton
            aria-label="Twitter"
            colorScheme="green"
            variant="ghost"
            icon={<AiFillTwitterSquare size="35px" />}
          />
        </CustomChakraNextLink>
        <CustomChakraNextLink href="https://tiktok.com/@aaafuria">
          <IconButton
            aria-label="TikTok"
            colorScheme="green"
            variant="ghost"
            icon={<FaTiktok size="35px" />}
          />
        </CustomChakraNextLink>
      </HStack>
    </Box>
  );
};
