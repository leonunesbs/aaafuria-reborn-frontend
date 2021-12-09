import CustomButtom from '../CustomButtom';
import React from 'react';
import { AiFillHome, AiFillIdcard } from 'react-icons/ai';
import { Divider, Stack, StackProps } from '@chakra-ui/react';
import { FaVolleyballBall } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { MdManageAccounts } from 'react-icons/md';
import { useRouter } from 'next/router';

interface AreaSocioMenuProps extends StackProps {
  handleAssociacao: () => void;
}

function AreaSocioMenu({ handleAssociacao, ...rest }: AreaSocioMenuProps) {
  const router = useRouter();
  return (
    <Stack {...rest}>
      <CustomButtom
        leftIcon={<AiFillIdcard size="20px" />}
        onClick={() => router.push('/carteirinha')}
      >
        Carteirinha
      </CustomButtom>
      <CustomButtom leftIcon={<FaVolleyballBall size="20px" />} isDisabled>
        Treinos
      </CustomButtom>
      <Divider height="15px" />
      <CustomButtom
        leftIcon={<MdManageAccounts size="20px" />}
        rightIcon={<FiExternalLink size="15px" />}
        colorScheme="yellow"
        onClick={handleAssociacao}
      >
        Gerenciar Associação
      </CustomButtom>
      <CustomButtom
        leftIcon={<AiFillHome size="20px" />}
        colorScheme="red"
        onClick={() => router.push('/')}
      >
        Voltar
      </CustomButtom>
    </Stack>
  );
}

export default AreaSocioMenu;
