import { CustomButton, CustomChakraNextLink } from '..';

import { Box } from '@chakra-ui/react';
import { MdArrowLeft } from 'react-icons/md';

export interface VoltarButtonProps {
  href: string;
}

export const VoltarButton = ({ href, ...rest }: VoltarButtonProps) => {
  return (
    <Box mt={4}>
      <CustomChakraNextLink href={href} {...rest}>
        <CustomButton colorScheme="red" leftIcon={<MdArrowLeft size="25px" />}>
          Voltar
        </CustomButton>
      </CustomChakraNextLink>
    </Box>
  );
};
