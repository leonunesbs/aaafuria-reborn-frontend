import {
  Box,
  Heading,
  HeadingProps,
  useColorModeValue,
} from '@chakra-ui/react';

import { CustomDivider } from '..';
import { ReactNode } from 'react';

export interface PageHeadingProps extends HeadingProps {
  children: ReactNode;
  divided?: boolean;
}

export const PageHeading = ({
  children,
  divided = true,
  ...rest
}: PageHeadingProps) => {
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
      {divided && <CustomDivider />}
    </Box>
  );
};
