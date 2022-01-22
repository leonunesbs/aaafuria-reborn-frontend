import router from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { Button } from '@chakra-ui/react';
import { MdManageAccounts } from 'react-icons/md';
import { useContext, useEffect } from 'react';

export interface AreaDiretorButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AreaDiretorButton = ({ setLoading }: AreaDiretorButtonProps) => {
  const { checkCredentials, isStaff } = useContext(AuthContext);

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  if (!isStaff) {
    return <></>;
  }

  return (
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
  );
};
