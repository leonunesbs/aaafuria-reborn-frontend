import {
  Box,
  Heading,
  HeadingProps,
  useColorModeValue,
} from '@chakra-ui/react';

import { ReactNode } from 'react';
import { CustomDivider } from '..';

export interface PageHeadingProps extends HeadingProps {
  children: ReactNode;
}

export const PageHeading = ({ children, ...rest }: PageHeadingProps) => {
  const color = useColorModeValue('gray.700', 'gray.100');
  return (
    <Box mb={4}>
      <Heading
        as="h1"
        textAlign="center"
        size="xl"
        fontWeight="extrabold"
        textColor={color}
        textTransform="uppercase"
        {...rest}
      >
        {children}
      </Heading>
      <CustomDivider />
    </Box>
  );
};
