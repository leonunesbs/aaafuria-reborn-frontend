import { Heading, HeadingProps, useColorModeValue } from '@chakra-ui/react';

import { ReactNode } from 'react';

export interface PageHeadingProps extends HeadingProps {
  children: ReactNode;
}

export const PageHeading = ({ children, ...rest }: PageHeadingProps) => {
  const color = useColorModeValue('gray.700', 'gray.100');
  return (
    <Heading
      as="h1"
      textAlign="center"
      size="xl"
      fontWeight="extrabold"
      textColor={color}
      mb={4}
      {...rest}
    >
      {children?.toString().toUpperCase()}
    </Heading>
  );
};
