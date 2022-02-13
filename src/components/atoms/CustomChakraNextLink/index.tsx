import { ReactNode } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link, LinkProps } from '@chakra-ui/react';

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
  return (
    <NextLink scroll={false} href={href} passHref {...rest}>
      <Link _hover={{ textDecoration: 'none' }} {...chakraLinkProps}>
        {children}
      </Link>
    </NextLink>
  );
};
