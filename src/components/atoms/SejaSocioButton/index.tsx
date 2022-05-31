import { CustomButton, CustomChakraNextLink } from '@/components/atoms';
import React, { useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { ButtonProps } from '@chakra-ui/button';
import { LoadingContext } from '@/contexts/LoadingContext';
import { MdGroups } from 'react-icons/md';

export type SejaSocioButtonProps = ButtonProps;

export const SejaSocioButton = ({ ...rest }: SejaSocioButtonProps) => {
  const { user } = useContext(AuthContext);
  const { loading, setLoading } = useContext(LoadingContext);

  if (user?.member.hasActiveMembership) {
    return <></>;
  }

  return (
    <CustomChakraNextLink href="/#seja-socio">
      <CustomButton
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
      </CustomButton>
    </CustomChakraNextLink>
  );
};
