import { ColorContext } from '@/contexts/ColorContext';
import { Flex } from '@chakra-ui/react';
import { useContext } from 'react';

export type CustomDividerProps = any;

function CustomDivider({ ...rest }: CustomDividerProps) {
  const { green } = useContext(ColorContext);
  return (
    <Flex
      as="hr"
      flexGrow={1}
      bgColor={green}
      h={'1px'}
      rounded="full"
      {...rest}
    />
  );
}

export default CustomDivider;
