import React from 'react';
import { Button, Divider, Stack, StackProps } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { AiFillIdcard, AiFillHome } from 'react-icons/ai';
import { FaVolleyballBall } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { MdManageAccounts } from 'react-icons/md';

interface AreaSocioMenuProps extends StackProps {
  handleAssociacao: () => void;
}

function AreaSocioMenu({ handleAssociacao, ...rest }: AreaSocioMenuProps) {
  const router = useRouter();
  return (
    <Stack {...rest}>
      <Button
        leftIcon={<AiFillIdcard size="20px" />}
        colorScheme="green"
        variant="ghost"
        onClick={() => router.push('/carteirinha')}
      >
        Carteirinha
      </Button>
      <Button
        leftIcon={<FaVolleyballBall size="20px" />}
        colorScheme="green"
        variant="ghost"
        isDisabled
      >
        Treinos
      </Button>
      <Divider height="15px" />
      <Button
        leftIcon={<MdManageAccounts size="20px" />}
        rightIcon={<FiExternalLink size="15px" />}
        colorScheme="yellow"
        variant="ghost"
        onClick={handleAssociacao}
      >
        Gerenciar Associação
      </Button>
      <Button
        leftIcon={<AiFillHome size="20px" />}
        colorScheme="red"
        variant="ghost"
        onClick={() => router.push('/')}
      >
        Voltar
      </Button>
    </Stack>
  );
}

export default AreaSocioMenu;
