import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { ButtonProps } from '@chakra-ui/button';
import { MdGroups } from 'react-icons/md';
import { CustomButtom, CustomChakraNextLink } from '@/components/atoms';

interface SejaSocioButtonProps extends ButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SejaSocioButton = ({
  setLoading,
  ...rest
}: SejaSocioButtonProps) => {
  const { checkCredentials, isSocio } = useContext(AuthContext);

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  if (isSocio) {
    return <></>;
  }

  return (
    <CustomChakraNextLink href="/sejasocio">
      <CustomButtom
        leftIcon={<MdGroups size="20px" />}
        variant="outline"
        onClick={() => {
          setLoading(true);
        }}
        {...rest}
      >
        Clique aqui e Seja Sócio!
      </CustomButtom>
    </CustomChakraNextLink>
  );
};
