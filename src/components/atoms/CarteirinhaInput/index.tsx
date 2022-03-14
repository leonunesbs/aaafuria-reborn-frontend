import { Input, useColorModeValue } from '@chakra-ui/react';

import { ICarteirinhaInput } from './ICarteirinhaInput';

export const CarteirinhaInput = ({ ...rest }: ICarteirinhaInput) => {
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
