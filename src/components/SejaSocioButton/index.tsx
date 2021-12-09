import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/button';
import router from 'next/router';
import { MdGroups } from 'react-icons/md';

interface SejaSocioButtonProps extends ButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function SejaSocioButton({ setLoading, ...rest }: SejaSocioButtonProps) {
  return (
    <Button
      as="h2"
      leftIcon={<MdGroups size="20px" />}
      colorScheme="green"
      variant="outline"
      onClick={() => {
        setLoading(true);
        router.push('/sejasocio');
      }}
      {...rest}
    >
      Clique aqui e Seja Sócio!
    </Button>
  );
}

export default SejaSocioButton;
