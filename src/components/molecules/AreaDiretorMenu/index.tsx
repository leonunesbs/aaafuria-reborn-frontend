import { CustomButtom, CustomChakraNextLink } from '@/components/atoms';
import { Divider, Stack, StackProps } from '@chakra-ui/react';
import { MdGroups, MdStore } from 'react-icons/md';

import { AiFillSetting } from 'react-icons/ai';
import { VoltarButton } from '@/components/atoms/VoltarButton';

export type AreaDiretorMenuProps = StackProps;

export const AreaDiretorMenu = ({ ...rest }: AreaDiretorMenuProps) => {
  return (
    <Stack {...rest}>
      <CustomChakraNextLink href="/areadiretor/plantao">
        <CustomButtom leftIcon={<MdStore size="20px" />}>Plantão</CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/areadiretor/associacao-manual">
        <CustomButtom leftIcon={<MdGroups size="20px" />}>
          Associação manual
        </CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/ajuda/gerenciar-solicitacoes">
        <CustomButtom leftIcon={<AiFillSetting size="20px" />}>
          Solicitações
        </CustomButtom>
      </CustomChakraNextLink>
      <CustomChakraNextLink
        chakraLinkProps={{
          target: '_blank',
        }}
        href="https://diretoria.aaafuria.site/admin"
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
      <VoltarButton href="/" />
    </Stack>
  );
};
