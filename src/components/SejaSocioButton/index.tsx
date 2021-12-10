import CustomButtom from '../CustomButtom';
import NextLink from 'next/link';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { ButtonProps } from '@chakra-ui/button';
import { chakra, Link } from '@chakra-ui/react';
import { MdGroups } from 'react-icons/md';

interface SejaSocioButtonProps extends ButtonProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function SejaSocioButton({ setLoading, ...rest }: SejaSocioButtonProps) {
  const ChakraNextLink = chakra(NextLink);
  const { checkCredentials, isSocio } = useContext(AuthContext);

  useEffect(() => {
    checkCredentials();
  }, [checkCredentials]);

  if (isSocio) {
    return <></>;
  }

  return (
    <ChakraNextLink passHref href="/sejasocio">
      <Link _hover={{ textDecoration: 'none' }}>
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
      </Link>
    </ChakraNextLink>
  );
}

export default SejaSocioButton;
