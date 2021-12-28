import {
  ColorModeToggle,
  CustomChakraNextLink,
  CustomIconButton,
} from '@/components/atoms';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { AiFillHome } from 'react-icons/ai';

export const Header = () => {
  const bg = useColorModeValue('white', 'gray.800');
  return (
    <Flex justify="space-between" bg={bg} py="2" px={{ base: '4', lg: '8' }}>
      <CustomChakraNextLink href="/">
        <CustomIconButton
          aria-label="início"
          icon={<AiFillHome size="20px" />}
        />
      </CustomChakraNextLink>
      <ColorModeToggle />
    </Flex>
  );
};
