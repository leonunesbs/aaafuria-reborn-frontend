import React from 'react';
import router from 'next/router';
import { AiFillHome } from 'react-icons/ai';
import { Button, Divider, Stack, StackProps } from '@chakra-ui/react';
import { MdStore } from 'react-icons/md';

type AreaDiretorMenuProps = StackProps;

function AreaDiretorMenu({ ...rest }: AreaDiretorMenuProps) {
  return (
    <Stack {...rest}>
      <Button
        leftIcon={<MdStore size="20px" />}
        colorScheme="green"
        variant="ghost"
        onClick={() => router.push('/areadiretor/plantao')}
      >
        Plantão
      </Button>

      <Divider height="15px" />

      <Button
        leftIcon={<AiFillHome size="20px" />}
        colorScheme="gray"
        onClick={() => router.push('/')}
      >
        Voltar
      </Button>
    </Stack>
  );
}

export default AreaDiretorMenu;
