import { Divider, Stack, StackProps } from '@chakra-ui/react';
import React from 'react';
import { AiFillHome, AiFillSetting } from 'react-icons/ai';
import { MdStore } from 'react-icons/md';
import CustomButtom from '../CustomButtom';
import CustomChakraNextLink from '../CustomChakraNextLink';

type AreaDiretorMenuProps = StackProps;

function AreaDiretorMenu({ ...rest }: AreaDiretorMenuProps) {
  return (
    <Stack {...rest}>
      <CustomChakraNextLink href="/areadiretor/plantao">
        <CustomButtom leftIcon={<MdStore size="20px" />}>Plantão</CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink
        chakraLinkProps={{
          target: '_blank',
        }}
        href={`${process.env.BACKEND_DOMAIN}/admin`}
      >
        <CustomButtom
          leftIcon={<AiFillSetting size="20px" />}
          colorScheme="yellow"
          hasExternalIcon
        >
          Painel
        </CustomButtom>
      </CustomChakraNextLink>

      <Divider height="15px" />

      <CustomChakraNextLink href="/">
        <CustomButtom leftIcon={<AiFillHome size="20px" />} colorScheme="gray">
          Voltar
        </CustomButtom>
      </CustomChakraNextLink>

    </Stack>
  );
}

export default AreaDiretorMenu;
