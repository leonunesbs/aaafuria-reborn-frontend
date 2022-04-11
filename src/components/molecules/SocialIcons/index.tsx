import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
} from 'react-icons/ai';
import { CustomChakraNextLink, CustomIconButton } from '@/components/atoms';

import { ButtonGroup } from '@chakra-ui/react';
import { FaTiktok } from 'react-icons/fa';
import React from 'react';

export const SocialIcons = () => {
  return (
    <ButtonGroup variant={'ghost'} alignSelf="center">
      <CustomChakraNextLink href="https://facebook.com/aaafuria">
        <CustomIconButton
          aria-label="Facebook"
          colorScheme="green"
          icon={<AiFillFacebook size="35px" />}
        />
      </CustomChakraNextLink>
      <CustomChakraNextLink href="https://instagram.com/aaafuria">
        <CustomIconButton
          aria-label="Instagram"
          colorScheme="green"
          icon={<AiFillInstagram size="35px" />}
        />
      </CustomChakraNextLink>
      <CustomChakraNextLink href="https://twitter.com/Aaafuria">
        <CustomIconButton
          aria-label="Twitter"
          colorScheme="green"
          icon={<AiFillTwitterSquare size="35px" />}
        />
      </CustomChakraNextLink>
      <CustomChakraNextLink href="https://tiktok.com/@aaafuria">
        <CustomIconButton
          aria-label="TikTok"
          colorScheme="green"
          icon={<FaTiktok size="35px" />}
        />
      </CustomChakraNextLink>
    </ButtonGroup>
  );
};
