import { CustomButton, CustomChakraNextLink } from '@/components/atoms';
import { Divider, Stack, StackProps } from '@chakra-ui/react';
import { MdGroups, MdHelpCenter, MdStore } from 'react-icons/md';

import { AiFillSetting } from 'react-icons/ai';
import { VoltarButton } from '@/components/atoms/VoltarButton';

export type AreaDiretorMenuProps = StackProps;

export const AreaDiretorMenu = ({ ...rest }: AreaDiretorMenuProps) => {
  return (
    <Stack {...rest}>
      <CustomChakraNextLink href="/areadiretor/plantao">
        <CustomButton leftIcon={<MdStore size="20px" />}>Plantão</CustomButton>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/areadiretor/associacao-manual">
        <CustomButton leftIcon={<MdGroups size="20px" />}>
          Associação manual
        </CustomButton>
      </CustomChakraNextLink>
      <CustomChakraNextLink href="/ajuda/gerenciar-solicitacoes">
        <CustomButton leftIcon={<MdHelpCenter size="25px" />}>
          Gerenciar solicitações
        </CustomButton>
      </CustomChakraNextLink>
      <CustomChakraNextLink
        chakraLinkProps={{
          target: '_blank',
        }}
        href="https://diretoria.aaafuria.site/admin"
      >
        <CustomButton
          leftIcon={<AiFillSetting size="20px" />}
          colorScheme="yellow"
          hasExternalIcon
        >
          Painel
        </CustomButton>
      </CustomChakraNextLink>
      <Divider height="15px" />
      <VoltarButton href="/" />
    </Stack>
  );
};
