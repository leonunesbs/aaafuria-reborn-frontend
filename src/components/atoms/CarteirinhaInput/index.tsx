import { Input, InputProps, useColorModeValue } from '@chakra-ui/react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CarteirinhaInputProps extends InputProps {}

export const CarteirinhaInput = ({ ...rest }: CarteirinhaInputProps) => {
  const color = useColorModeValue('green.900', 'green.900');

  return (
    <Input
      variant="fluxed"
      isReadOnly
      color={color}
      bgColor="green.100"
      {...rest}
    />
  );
};
