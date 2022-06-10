import { AreaDiretorButton, CustomButton } from '@/components/atoms';
import { MdLogout, MdPerson } from 'react-icons/md';
import { useCallback, useContext } from 'react';

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
    router.push('/areamembro');
  }, [router, setLoading]);

  const onClickSignOut = useCallback(() => {
    setLoading(true);
    signOut();
  }, [signOut, setLoading]);

  return (
    <>
      <CustomButton
        name="area-socio"
        leftIcon={<MdPerson size="20px" />}
        onClick={() => {
          onClickAreaSocio();
          router.push('/areamembro');
        }}
      >
        Área do Membro
      </CustomButton>
      <AreaDiretorButton />
      <CustomButton
        name="sair"
        leftIcon={<MdLogout size="20px" />}
        colorScheme="red"
        onClick={onClickSignOut}
      >
        Sair
      </CustomButton>
    </>
  );
};
