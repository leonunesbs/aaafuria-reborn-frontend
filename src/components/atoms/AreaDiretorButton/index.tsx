import { useCallback, useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { CustomButtom } from '@/components/atoms';
import { LoadingContext } from '@/contexts/LoadingContext';
import { MdManageAccounts } from 'react-icons/md';
import router from 'next/router';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AreaDiretorButtonProps {}

export const AreaDiretorButton = ({}: AreaDiretorButtonProps) => {
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
    <CustomButtom
      display={isStaff ? 'flex' : 'none'}
      leftIcon={<MdManageAccounts size="20px" />}
      colorScheme="yellow"
      isLoading={loading}
      onClick={onClickAreaDiretor}
    >
      Área do Diretor
    </CustomButtom>
  );
};
