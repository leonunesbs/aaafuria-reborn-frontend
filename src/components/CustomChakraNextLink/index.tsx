import { ReactNode } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link, LinkProps } from '@chakra-ui/react';

interface CustomChakraNextLinkProps extends NextLinkProps {
  children: ReactNode;
  chakraLinkProps?: LinkProps;
}

function CustomChakraNextLink({
  children,
  href,
  chakraLinkProps,
  ...rest
}: CustomChakraNextLinkProps) {
  return (
    <NextLink href={href} passHref {...rest}>
      <Link _hover={{ textDecoration: 'none' }} {...chakraLinkProps}>
        {children}
      </Link>
    </NextLink>
  );
}

export default CustomChakraNextLink;
