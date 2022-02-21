import { Box } from '@chakra-ui/react';
import { MdArrowLeft } from 'react-icons/md';
import { CustomButtom, CustomChakraNextLink } from '..';

export interface VoltarButtonProps {
  href: string;
}

export const VoltarButton = ({ href, ...rest }: VoltarButtonProps) => {
  return (
    <Box mt={4}>
      <CustomChakraNextLink href={href} {...rest}>
        <CustomButtom colorScheme="red" leftIcon={<MdArrowLeft size="25px" />}>
          Voltar
        </CustomButtom>
      </CustomChakraNextLink>
    </Box>
  );
};
