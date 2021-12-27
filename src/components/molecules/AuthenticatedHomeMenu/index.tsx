import React, { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { MdLogout, MdPerson } from 'react-icons/md';
import { useRouter } from 'next/router';
import {
  AreaDiretorButton,
  CustomButtom,
  CustomChakraNextLink,
} from '@/components/atoms';

interface AuthenticatedHomeMenuProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthenticatedHomeMenu = ({
  setLoading,
}: AuthenticatedHomeMenuProps) => {
  const router = useRouter();
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <CustomChakraNextLink href="/areasocio">
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
      </CustomChakraNextLink>
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
};
