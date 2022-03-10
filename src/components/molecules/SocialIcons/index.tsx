import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
} from 'react-icons/ai';
import {
  Box,
  Divider,
  HStack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { CustomChakraNextLink, CustomIconButton } from '@/components/atoms';

import { FaTiktok } from 'react-icons/fa';
import React from 'react';

export const SocialIcons = ({ ...rest }) => {
  const greenColor = useColorModeValue('green.700', 'green.200');
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
          <CustomIconButton
            aria-label="Facebook"
            colorScheme="green"
            variant="ghost"
            icon={<AiFillFacebook size="35px" />}
          />
        </CustomChakraNextLink>
        <CustomChakraNextLink href="https://instagram.com/aaafuria">
          <CustomIconButton
            aria-label="Instagram"
            colorScheme="green"
            variant="ghost"
            icon={<AiFillInstagram size="35px" />}
          />
        </CustomChakraNextLink>
        <CustomChakraNextLink href="https://twitter.com/Aaafuria">
          <CustomIconButton
            aria-label="Twitter"
            colorScheme="green"
            variant="ghost"
            icon={<AiFillTwitterSquare size="35px" />}
          />
        </CustomChakraNextLink>
        <CustomChakraNextLink href="https://tiktok.com/@aaafuria">
          <CustomIconButton
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
