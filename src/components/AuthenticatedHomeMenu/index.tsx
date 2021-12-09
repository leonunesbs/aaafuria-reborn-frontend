import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { MdPerson, MdLogout, MdManageAccounts } from 'react-icons/md';
import { AuthContext } from '@/contexts/AuthContext';
import { parseCookies } from 'nookies';

interface AuthenticatedHomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
function AuthenticatedHomeMenu({ setLoading }: AuthenticatedHomeMenuProps) {
  const router = useRouter();
  const { checkSocio, signOut } = useContext(AuthContext);
  const [isStaff, setIsStaff] = React.useState(
    parseCookies()['aaafuriaIsStaff'],
  );
  useEffect(() => {
    checkSocio();
    setIsStaff(parseCookies()['aaafuriaIsStaff']);
  }, [checkSocio]);

  return (
    <>
      <Button
        as="h2"
        leftIcon={<MdPerson size="20px" />}
        colorScheme="green"
        variant="ghost"
        onClick={() => {
          setLoading(true);
          router.push('/areasocio');
        }}
      >
        Área do Sócio
      </Button>
      {isStaff === 'true' && (
        <Button
          as="h2"
          leftIcon={<MdManageAccounts size="20px" />}
          colorScheme="yellow"
          variant="ghost"
          onClick={() => {
            setLoading(true);
            router.push('/areadiretor');
          }}
        >
          Área do Diretor
        </Button>
      )}
      <Button
        as="h2"
        leftIcon={<MdLogout size="20px" />}
        colorScheme="red"
        variant="ghost"
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
