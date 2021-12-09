import router from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import { Button } from '@chakra-ui/react';
import { MdManageAccounts } from 'react-icons/md';
import { parseCookies } from 'nookies';
import { useContext, useEffect, useState } from 'react';

interface AreaDiretorButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function AreaDiretorButton({ setLoading }: AreaDiretorButtonProps) {
  const { checkSocio } = useContext(AuthContext);
  const [isStaff, setIsStaff] = useState(false);
  useEffect(() => {
    checkSocio();
    setIsStaff(parseCookies()['aaafuriaIsStaff'] === 'true');
  }, [checkSocio]);

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
