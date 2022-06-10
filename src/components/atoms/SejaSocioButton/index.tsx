import { AuthContext } from '@/contexts/AuthContext';
import { ButtonProps } from '@chakra-ui/button';
import { CustomButton } from '@/components/atoms';
import { LoadingContext } from '@/contexts/LoadingContext';
import { MdGroups } from 'react-icons/md';
import { useContext } from 'react';
import { useRouter } from 'next/router';

export type SejaSocioButtonProps = ButtonProps;

export const SejaSocioButton = ({ ...rest }: SejaSocioButtonProps) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { loading, setLoading } = useContext(LoadingContext);

  if (user?.member.hasActiveMembership) {
    return <></>;
  }

  return (
    <CustomButton
      name="sejasocio"
      leftIcon={<MdGroups size="20px" />}
      variant="outline"
      isLoading={loading}
      onClick={() => {
        setLoading(true);
        router.push('/#seja-socio');
      }}
      {...rest}
    >
      Clique aqui e Seja Sócio!
    </CustomButton>
  );
};
