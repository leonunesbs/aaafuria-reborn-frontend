import router from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { Button } from '@chakra-ui/react';
import { MdManageAccounts } from 'react-icons/md';
import { useContext, useEffect } from 'react';

interface AreaDiretorButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function AreaDiretorButton({ setLoading }: AreaDiretorButtonProps) {
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
}

export default AreaDiretorButton;
