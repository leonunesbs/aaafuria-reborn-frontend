import {
  AreaDiretorButton,
  CustomButtom,
  CustomChakraNextLink,
} from '@/components/atoms';
import { MdLogout, MdPerson } from 'react-icons/md';
import React, { useCallback, useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { IAuthenticatedHomeMenu } from './IAuthenticatedHomeMenu';
import { LoadingContext } from '@/contexts/LoadingContext';
import { useRouter } from 'next/router';

export const AuthenticatedHomeMenu = ({}: IAuthenticatedHomeMenu) => {
  const router = useRouter();
  const { signOut } = useContext(AuthContext);
  const { setLoading } = useContext(LoadingContext);

  const onClickAreaSocio = useCallback(() => {
    setLoading(true);
    router.push('/areasocio');
  }, [router, setLoading]);

  const onClickSignOut = useCallback(() => {
    setLoading(true);
    signOut();
  }, [signOut, setLoading]);

  return (
    <>
      <CustomChakraNextLink href="/areasocio">
        <CustomButtom
          name="area-socio"
          leftIcon={<MdPerson size="20px" />}
          onClick={onClickAreaSocio}
        >
          Área do Sócio
        </CustomButtom>
      </CustomChakraNextLink>
      <AreaDiretorButton />
      <CustomButtom
        name="sair"
        leftIcon={<MdLogout size="20px" />}
        colorScheme="red"
        onClick={onClickSignOut}
      >
        Sair
      </CustomButtom>
    </>
  );
};
