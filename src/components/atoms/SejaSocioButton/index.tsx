import { CustomButtom, CustomChakraNextLink } from '@/components/atoms';
import React, { useContext, useEffect } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ButtonProps } from '@chakra-ui/button';
import { LoadingContext } from '@/contexts/LoadingContext';
import { MdGroups } from 'react-icons/md';

export type SejaSocioButtonProps = ButtonProps;

export const SejaSocioButton = ({ ...rest }: SejaSocioButtonProps) => {
  const { checkCredentials, isSocio } = useContext(AuthContext);
  const { loading, setLoading } = useContext(LoadingContext);

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
        isLoading={loading}
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
