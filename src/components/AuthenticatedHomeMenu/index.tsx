import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { MdPerson, MdLogout, MdManageAccounts } from 'react-icons/md';
import { AuthContext } from '@/contexts/AuthContext';

interface AuthenticatedHomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
function AuthenticatedHomeMenu({ setLoading }: AuthenticatedHomeMenuProps) {
  const router = useRouter();
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <Button
        as="h2"
        leftIcon={<MdPerson size="20px" />}
        colorScheme="green"
        onClick={() => {
          setLoading(true);
          router.push('/areasocio');
        }}
      >
        Área do Sócio
      </Button>
      <Button
        as="h2"
        leftIcon={<MdManageAccounts size="20px" />}
        colorScheme="yellow"
        onClick={() => {
          setLoading(true);
          router.push('/areadiretor');
        }}
      >
        Área do Diretor
      </Button>
      <Button
        as="h2"
        leftIcon={<MdLogout size="20px" />}
        colorScheme="red"
        onClick={() => {
          setLoading(true);
          signOut();
        }}
      >
        Sair
      </Button>
    </>
  );
}

export default AuthenticatedHomeMenu;
