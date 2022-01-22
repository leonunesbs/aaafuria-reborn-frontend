import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { ButtonProps } from '@chakra-ui/button';
import { MdGroups } from 'react-icons/md';
import { CustomButtom, CustomChakraNextLink } from '@/components/atoms';

export interface SejaSocioButtonProps extends ButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SejaSocioButton = ({
  setLoading,
  ...rest
}: SejaSocioButtonProps) => {
  const { checkCredentials, isSocio } = useContext(AuthContext);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials, isSocio, setLoading]);

  if (isSocio) {
    return <></>;
  }

  return (
    <CustomChakraNextLink href="/sejasocio">
      <CustomButtom
        name="sejasocio"
        leftIcon={<MdGroups size="20px" />}
        variant="outline"
        isLoading={buttonLoading}
        onClick={() => {
          setLoading(true);
          setButtonLoading(true);
        }}
        {...rest}
      >
        Clique aqui e Seja Sócio!
      </CustomButtom>
    </CustomChakraNextLink>
  );
};
