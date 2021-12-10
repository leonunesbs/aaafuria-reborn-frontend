import React from 'react';
import router from 'next/router';
import { AiFillHome } from 'react-icons/ai';
import { Divider, Stack, StackProps } from '@chakra-ui/react';
import { MdStore } from 'react-icons/md';
import CustomButtom from '../CustomButtom';

type AreaDiretorMenuProps = StackProps;

function AreaDiretorMenu({ ...rest }: AreaDiretorMenuProps) {
  return (
    <Stack {...rest}>
      <CustomButtom
        leftIcon={<MdStore size="20px" />}
        onClick={() => router.push('/areadiretor/plantao')}
      >
        Plantão
      </CustomButtom>

      <Divider height="15px" />

      <CustomButtom
        leftIcon={<AiFillHome size="20px" />}
        colorScheme="gray"
        onClick={() => router.push('/')}
      >
        Voltar
      </CustomButtom>
    </Stack>
  );
}

export default AreaDiretorMenu;
