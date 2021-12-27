import { Heading, HeadingProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface PageHeadingProps extends HeadingProps {
  children: ReactNode;
}

export const PageHeading = ({ children, ...rest }: PageHeadingProps) => {
  return (
    <Heading
      as="h1"
      textAlign="center"
      size="xl"
      fontWeight="extrabold"
      mb={4}
      {...rest}
    >
      {children}
    </Heading>
  );
};
