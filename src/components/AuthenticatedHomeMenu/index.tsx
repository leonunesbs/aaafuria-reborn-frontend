import AreaDiretorButton from '../AreaDiretorButton';
import CustomButtom from '../CustomButtom';
import NextLink from 'next/link';
import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { chakra, Link } from '@chakra-ui/react';
import { MdLogout, MdPerson } from 'react-icons/md';
import { useRouter } from 'next/router';

interface AuthenticatedHomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
function AuthenticatedHomeMenu({ setLoading }: AuthenticatedHomeMenuProps) {
  const router = useRouter();
  const ChakraNextLink = chakra(NextLink);
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <ChakraNextLink href="/areasocio" passHref>
        <Link _hover={{ textDecoration: 'none' }}>
          <CustomButtom
            name="area-socio"
            leftIcon={<MdPerson size="20px" />}
            onClick={() => {
              setLoading(true);
              router.push('/areasocio');
            }}
          >
            Área do Sócio
          </CustomButtom>
        </Link>
      </ChakraNextLink>
      <AreaDiretorButton setLoading={setLoading} />
      <CustomButtom
        name="sair"
        leftIcon={<MdLogout size="20px" />}
        colorScheme="red"
        onClick={() => {
          setLoading(true);
          signOut();
        }}
      >
        Sair
      </CustomButtom>
    </>
  );
}

export default AuthenticatedHomeMenu;
