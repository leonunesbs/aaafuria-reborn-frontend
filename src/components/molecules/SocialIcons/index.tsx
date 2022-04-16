import { CustomChakraNextLink, CustomIconButton } from '@/components/atoms';
import { ButtonGroup, ButtonGroupProps } from '@chakra-ui/react';
import React from 'react';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
} from 'react-icons/ai';
import { FaTiktok } from 'react-icons/fa';

export type ISocialIcons = ButtonGroupProps;

export const SocialIcons = ({ variant, ...rest }: ISocialIcons) => {
  return (
    <ButtonGroup alignSelf="center" {...rest}>
      <CustomChakraNextLink href="https://facebook.com/aaafuria">
        <CustomIconButton
          aria-label="Facebook"
          variant={variant}
          icon={<AiFillFacebook size="35px" />}
        />
      </CustomChakraNextLink>
      <CustomChakraNextLink href="https://instagram.com/aaafuria">
        <CustomIconButton
          aria-label="Instagram"
          variant={variant}
          icon={<AiFillInstagram size="35px" />}
        />
      </CustomChakraNextLink>
      <CustomChakraNextLink href="https://twitter.com/Aaafuria">
        <CustomIconButton
          aria-label="Twitter"
          variant={variant}
          icon={<AiFillTwitterSquare size="35px" />}
        />
      </CustomChakraNextLink>
      <CustomChakraNextLink href="https://tiktok.com/@aaafuria">
        <CustomIconButton
          aria-label="TikTok"
          variant={variant}
          icon={<FaTiktok size="35px" />}
        />
      </CustomChakraNextLink>
    </ButtonGroup>
  );
};
