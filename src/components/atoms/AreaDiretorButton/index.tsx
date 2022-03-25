import { useCallback, useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/atoms';
import { IAreaDiretorButton } from './IAreaDiretorButton';
import { LoadingContext } from '@/contexts/LoadingContext';
import { MdManageAccounts } from 'react-icons/md';
import router from 'next/router';

export const AreaDiretorButton = ({}: IAreaDiretorButton) => {
  const { checkCredentials, isStaff } = useContext(AuthContext);
  const { setLoading, loading } = useContext(LoadingContext);

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  const onClickAreaDiretor = useCallback(() => {
    setLoading(true);
    router.push('/areadiretor');
  }, [setLoading]);

  return (
    <CustomButton
      display={isStaff ? 'flex' : 'none'}
      leftIcon={<MdManageAccounts size="20px" />}
      colorScheme="yellow"
      isLoading={loading}
      onClick={onClickAreaDiretor}
    >
      Área do Diretor
    </CustomButton>
  );
};
