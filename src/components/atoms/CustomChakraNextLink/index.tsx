import { Link, LinkProps } from '@chakra-ui/react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { ReactNode, useContext } from 'react';

import { ColorContext } from '@/contexts/ColorContext';

export interface CustomChakraNextLinkProps extends NextLinkProps {
  children: ReactNode;
  chakraLinkProps?: LinkProps;
}

export const CustomChakraNextLink = ({
  children,
  href,
  chakraLinkProps,
  ...rest
}: CustomChakraNextLinkProps) => {
  const { green } = useContext(ColorContext);
  return (
    <NextLink scroll={false} href={href} passHref {...rest}>
      <Link
        href={href as string}
        borderRadius={'md'}
        _hover={{ textDecoration: 'none' }}
        _focus={{
          outlineColor: green,
          outlineWidth: 'thin',
        }}
        {...chakraLinkProps}
      >
        {children}
      </Link>
    </NextLink>
  );
};
