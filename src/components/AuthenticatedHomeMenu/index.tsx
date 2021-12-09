import { Button, chakra, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { MdPerson, MdLogout, MdManageAccounts } from 'react-icons/md';
import { AuthContext } from '@/contexts/AuthContext';
import { parseCookies } from 'nookies';
import NextLink from 'next/link';

interface AuthenticatedHomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
function AuthenticatedHomeMenu({ setLoading }: AuthenticatedHomeMenuProps) {
  const router = useRouter();
  const { checkSocio, signOut } = useContext(AuthContext);
  const [isStaff, setIsStaff] = React.useState(
    parseCookies()['aaafuriaIsStaff'],
  );
  const ChakraNextLink = chakra(NextLink);
  useEffect(() => {
    checkSocio();
    setIsStaff(parseCookies()['aaafuriaIsStaff']);
  }, [checkSocio]);

  return (
    <>
      <ChakraNextLink href="/areasocio" passHref>
        <Link _hover={{ textDecoration: 'none' }}>
          <Button
            as="h2"
            name="area-socio"
            leftIcon={<MdPerson size="20px" />}
            colorScheme="green"
            variant="ghost"
            onClick={() => {
              setLoading(true);
              router.push('/areasocio');
            }}
            w="full"
          >
            Área do Sócio
          </Button>
        </Link>
      </ChakraNextLink>
      {isStaff === 'true' && (
        <Button
          as="h2"
          name="area-diretor"
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
        name="sair"
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
